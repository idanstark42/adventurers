import React from 'react'
import { useStytch } from '@stytch/react'
import { GiExitDoor } from 'react-icons/gi'

export default function LogoutButton () {
  const stytch = useStytch()

  const logout = () => {
    stytch.session.revoke()
    window.location = '/'
  }

  return <button className='logout-button' onClick={logout}>
    <GiExitDoor />
  </button>
}