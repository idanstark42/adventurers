import React, { useEffect } from 'react'
import { useStytch, useStytchSession } from '@stytch/react'

import Loader from '../components/loader'

export default function Authenticate () {
  const stytch = useStytch()
  const { session } = useStytchSession()

  useEffect(() => {
    if (session) {
      window.location.href = `${window.location.origin}/edit/${session.user_id}`
    } else {
      const token = new URLSearchParams(window.location.search).get('token')
      if (token) {
        stytch.oauth.authenticate(token, { session_duration_minutes: 60 })
      }
    }
  }, [stytch, session])

  return <Loader />
}