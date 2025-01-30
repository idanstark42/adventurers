import { Navigate } from 'react-router'
import { useStytch } from '@stytch/react'

import AdventurerScreen from '../components/adventurer-screen'

export default function Edit () {
  const { user } = useStytch()

  if (!user.getInfo().user) {
    return <Navigate to='/' />
  }

  return <AdventurerScreen editable />
}