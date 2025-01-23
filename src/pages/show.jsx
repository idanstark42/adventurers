
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'

import { useLilo } from '../logic/lilo'
import AdventurerScreen from '../components/adventurer-screen'

export default function Edit () {
  const navigate = useNavigate()
  const { isOwner, data } = useLilo()
  return <AdventurerScreen>
    {isOwner && <div className='edit' onClick={() => navigate(`/edit/${data.owner_id}`)}><FaEdit /></div>}
  </AdventurerScreen>
}