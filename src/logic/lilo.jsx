import { useEffect, useState, createContext, useContext } from "react"
import { useStytch } from '@stytch/react'
import Loader from "../components/loader"

const LiloContext = createContext()

const LOADING_THROTTLE = 1000

const DEFAULT_SETTINGS = {
  reload: false,
  createIfEmpty: false,
  type: 'single',
  filterType: 'path', // 'path', 'query', 'element', 'auth' or 'none'ת
  unAuthRedirect: '/'
}

export function LiloProvider({ children, ...settings }) {
  Object.assign(settings, DEFAULT_SETTINGS)
  const stytch = useStytch()
  const [data, setData] = useState(settings.type === 'single' ? null : [])
  const [loading, setLoading] = useState(true)
  const [lilo, setLilo] = useState(null)

  useEffect(() => {
    const lilo = settings.type === 'single' ? new SingleDatabaseClient(stytch, settings) : new MultiDatabaseClient(stytch, settings)
    load(lilo)
    setLilo(lilo)
  }, [])

  const load = async (lilo) => {
    return await whileLoading(() => lilo.init().then(data => setData(data)))
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${stytch.session.getTokens().session_token}` },
      body: formData
    })
    return await response.json()
  }

  const whileLoading = async (callback) => {
    const start = Date.now()
    setLoading(true)
    await callback()
    const loadingTime = Date.now() - start
    console.log('Loading time:', loadingTime, 'waiting for', Math.max(0, LOADING_THROTTLE - loadingTime))
    setTimeout(() => setLoading(false), Math.max(0, LOADING_THROTTLE - loadingTime))
  }

  if (!lilo) {
    return <Loader />
  }

  const userId = stytch.user?.getInfo()?.user?.user_id

  const wrapper = {
    data,
    loading,
    userId,
    isOwner: (Boolean(data?.owner_id) && Boolean(userId) && data?.owner_id === userId),
    read: (...args) => whileLoading(() => lilo.read(...args)),
    update: (...args) => whileLoading(() => lilo.update(...args).then(() => load(lilo))),
    delete: (...args) => whileLoading(() => lilo.delete(...args).then(() => load(lilo))),
    create: (...args) => whileLoading(() => lilo.create(...args).then(() => load(lilo))),
    uploadImage
  }

  return <LiloContext.Provider value={wrapper}>{children}</LiloContext.Provider>
}

export function useLilo() {
  return useContext(LiloContext)
}

class DatabaseClient {
  constructor(stytch, settings) {
    this.stytch = stytch
    this.settings = settings
    this.options = Object.assign({}, settings.options || {})
  }

  async request(action, data={}, filter={}, options={}) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/database`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ action, collection: this.settings.collection, data, filter, options })
      })
      const json = await response.json()
      return json.result
    } catch (error) {
      if (error.status === 401) {
        window.location.href = `${window.location.origin}${this.settings.unAuthRedirect}`
      }
      console.error(error)
    }
  }

  get token() {
    return this.stytch?.session?.getTokens()?.session_token
  }

  get headers() {
    const headers = { 'Content-Type': 'application/json' }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  get filter() {
    switch (this.settings.filterType) {
      case 'path':
        const path = window.location.pathname.split('/')
        return { owner_id: path[path.length - 1] }
      case 'query':
        const query = new URLSearchParams(window.location.search)
        return { owner_id: query.get('id') }
      case 'element':
        const element = document.querySelector('[owner-id]')
        return { owner_id: element?.getAttribute('owner-id') }
      case 'auth':
        return { owner_id: this.stytch.user?.getInfo()?.user?.user_id }
      case 'none':
        return {}
    }
  }
}

class SingleDatabaseClient extends DatabaseClient {
  constructor(stytch, settings) {
    super(stytch, settings)
    Object.assign(this.options, { limit: 1 })
  }

  async init () {
    const { createIfEmpty } = this.settings
    return await this.read().then(data => {
      if (!data && createIfEmpty) {
        return this.create().then(() => this.read())
      }
      return data
    })
  }

  async read(filter={}) {
    return await this.request('read', {}, Object.assign({}, filter, this.filter), this.options).then(data => data[0])
  }

  async update(filter, data) {
    return await this.request('update', data, Object.assign({}, filter, this.filter), this.options)
  }

  async delete(filter) {
    return await this.request('delete', {}, Object.assign({}, filter, this.filter), this.options)
  }

  async create(data) {
    return await this.request('create', data, {}, this.options)
  }
}

class MultiDatabaseClient extends DatabaseClient {
  async init () {
    const { createIfEmpty } = this.settings
    return await this.read().then(data => {
      if (!data.length && createIfEmpty) {
        return this.create().then(() => this.read())
      }
      return data
    })
  }

  async read(filter) {
    return await this.request('read', {}, Object.assign({}, filter, this.filter), this.options)
  }

  async update(filter, data) {
    return await this.request('update', data, Object.assign({}, filter, this.filter), this.options)
  }

  async delete(filter) {
    return await this.request('delete', {}, Object.assign({}, filter, this.filter), this.options)
  }

  async create(data) {
    return await this.request('create', data, {}, this.options)
  }
}
