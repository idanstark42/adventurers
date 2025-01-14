import { useStytch } from '@stytch/react'

import Logo from '../assets/icon.png'

export default function HomeScreen () {
  const stytch = useStytch()

  const startOAuth = () => stytch.oauth.google.start({
    login_redirect_url: `${window.location.origin}/auth/callback`,
    signup_redirect_url: `${window.location.origin}/auth/callback`
  })

  return <main>
    <img src={Logo} alt="Adventurers logo" />
    <button onClick={startOAuth}>Log in with Google</button>;
  </main>
}
