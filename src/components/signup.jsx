import { PayPalButtons } from '@paypal/react-paypal-js'

import { useLilo } from '../logic/lilo'
import Logo from '../assets/icon.png'

const EMPTY_ADVENTURER = {
  name: 'Enter your name',
  bio: 'Enter your bio',
  image: null,
  stats: {},
  skills: {},
  history: [],
  inventory: [],
  bucketlist: [],
  socialLinks: []
}

export default function Signup () {
  const { create } = useLilo()

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ description: "Account", amount: { currency_code: "USD", value: 5 } }]
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture()
      .then(() => create(EMPTY_ADVENTURER))
  }

  return <div className='signup'>
    <div className='header'>
      <img src={Logo} alt="Adventurers logo" />
      <div className='title'>Sign Up</div>
      <div className='description'>Create an account to start your adventure!</div>
    </div>
    <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: 'vertical' }} />
  </div>
}
