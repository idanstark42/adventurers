import React, { useState } from 'react'
import { SocialIcon } from 'react-social-icons'
import { FaSave, FaPlus } from 'react-icons/fa'

const DEFAULT_FORM_VALUES = {
  objective: '',
  dateDone: null
}

const PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest']

export default function ({ link, editable, save }) {
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const adding = !link
  const done = !adding && link.dateDone
  const [formValues, setFormValues] = useState(adding ? DEFAULT_FORM_VALUES : { objective: link.objective, dateDone: link.dateDone })

  const handleClick = () => {
    if (!editable) return
    setEditingModalOpen(true)
  }

  const saveEdit = async () => {
    await save(data => {
      if (adding) {
        data.bucketlist.push(formValues)
      } else {
        Object.assign(link, formValues)
      }
      return data
    })
    if (adding) setFormValues(DEFAULT_FORM_VALUES)
    setEditingModalOpen(false)
  }

  const closeEditing = event => {
    if (adding) setFormValues(DEFAULT_FORM_VALUES)
    setEditingModalOpen(false)
    event.stopPropagation()
  }

  return <div className={`bucketlist-link ${adding ? 'adding' : ''}`} onClick={handleClick}>
    {adding ? <div className='add-link-button' style={{ height: '2rem', width: '2rem' }}><FaPlus /></div> : <>
      <SocialIcon url={link.link} network={link.platform} style={{ height: '2rem', width: '2rem' }} /> 
      <div className='objective'>{link.objective}</div>
      <div className='date-done'>{link.dateDone}</div>
    </>}
    {editingModalOpen && <div className='modal open' onClick={closeEditing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Network</label>
          <div className='platforms' style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {PLATFORMS.map(platform => <SocialIcon className={formValues.platform === platform ? 'selected' : ''} network={platform} style={{ height: '2rem', width: '2rem' }} onClick={() => setFormValues({ ...formValues, platform })} />)}
          </div>
        </div>
        <div className='field'>
          <label>Link</label>
          <input type='text' value={formValues.link} onChange={e => setFormValues({ ...formValues, link: e.target.value })} />
        </div>
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
        </div>
      </div>
    </div>}
  </div>
}