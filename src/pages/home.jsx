import { useStytch } from '@stytch/react'
import { GoogleLoginButton } from 'react-social-login-buttons'

import './home.css'

import Logo from '../assets/icon.png'
import Frontpage from '../assets/frontpage.jpg'

export default function HomeScreen () {
  const stytch = useStytch()

  const startOAuth = () => stytch.oauth.google.start({
    login_redirect_url: `${window.location.origin}/auth/callback`,
    signup_redirect_url: `${window.location.origin}/auth/callback`
  })

  return <main className='home' style={{ backgroundImage: `url(${Frontpage})` }}>
    <div className='titles'>
      <img src={Logo} alt="Adventurers logo" />
      <div className='title'>Adventurers</div>
    </div>
    <div className='buttons'>
      <GoogleLoginButton onClick={startOAuth}>Log in with Google</GoogleLoginButton>
    </div>
  </main>
}
