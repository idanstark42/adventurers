import { FaShareAlt } from 'react-icons/fa'

const ShareButton = ({ title, text, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        alert('Failed to share. Please try again.')
      }
    } else {
      alert('Sharing not supported on this device.')
    }
  }

  return <button onClick={handleShare} className='share-button'>
    <FaShareAlt />
  </button>
}

export default ShareButton
