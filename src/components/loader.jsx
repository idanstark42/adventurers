import BACKGROUND from '../assets/loader-background.jpg'

export default function Loader () {
  return <div className='loader' style={{ backgroundImage: `url(${BACKGROUND})` }}>
    <div className='loader-content'>
        <h1>Adventurers</h1>
        <p>Loading...</p>
    </div>
  </div>
}