
import { useNavigate } from 'react-router-dom'
import { useLilo } from '../logic/lilo'
import AdventurerScreen from '../components/adventurer-screen'

export default function Edit () {
  const navigate = useNavigate()
  const { isOwner, data } = useLilo()
  return <AdventurerScreen>
    {isOwner && <div className='edit' onClick={() => navigate(`/edit/${data.owner_id}`)}>Edit</div>}
  </AdventurerScreen>
}