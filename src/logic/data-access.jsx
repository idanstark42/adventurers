import { useEffect, useState, createContext, useContext } from "react"
import { useStytch } from '@stytch/react'

const DataContext = createContext()

export function DataProvider({ children, reload }) {
  const stytch = useStytch()
  const [data, setData] = useState()

  useEffect(() => {
    if (reload || !data) {
      const tokens = stytch.session.getTokens()
      fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.session_token}`
        },
        body: JSON.stringify({ action: 'read', collection: 'adventurers' })
      })
        .then((res) => res.json())
        .then(data => {
          if (data.result.length > 0) {
            setData(data.result[0])
          } else {
            fetch (`${import.meta.env.VITE_BACKEND_URL}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens.session_token}`
              },
              body: JSON.stringify({ action: 'create', collection: 'adventurers', data: {} })
            })
              .then((res) => res.json())
              .then(data => {
                setData(data.result[0])
              })
          }
        })
    }
  }, [reload, data])

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

export function useData() {
  return useContext(DataContext)
}
