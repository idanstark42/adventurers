import React, { useState } from 'react'
import { FaSave } from 'react-icons/fa'

import { useLilo } from '../logic/lilo'

import ITEM_IMAGE from '../assets/item.jpeg'

const DEFAULT_FORM_VALUES = {
  name: '',
  quantity: 1,
  image: '',
  imageFilename: '',
  description: ''
}

export default function ({ item, editable, save }) {
  const { uploadImage } = useLilo()
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const [viewingModalOpen, setViewingModalOpen] = useState(false)
  const adding = !item
  const [formValues, setFormValues] = useState(adding ? DEFAULT_FORM_VALUES : { name: item.name, quantity: item.quantity, image: item.image, imageFilename: '', description: item.description || '' })

  const handleClick = () => {
    if (!editable) {
      setViewingModalOpen(true)
      return
    }
    setEditingModalOpen(true)
  }

  const saveEdit = async () => {
    await save(data => {
      if (adding) {
        data.inventory.push(formValues)
      } else {
        Object.assign(item, formValues)
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

  const closeViewing = event => {
    setViewingModalOpen(false)
    event.stopPropagation()
  }

  const setImage = async file => {
    const response = await uploadImage(file)
    setFormValues({ ...formValues, image: response.result.url, imageFilename: file.name })
  }

  return <div className={`item ${adding ? 'adding' : ''}`} onClick={handleClick}>
    {adding ? <span>Add Item</span> : <>
      <div className='image' style={{ backgroundImage: `url(${item.image || ITEM_IMAGE})` }} />
      <div className='name'>{item.name} {item.quantity > 1 ? `(${item.quantity})` : ''}</div>
    </>}
    {viewingModalOpen && <div className='modal open' onClick={closeViewing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='image-preview'>
          <img src={formValues.image || ITEM_IMAGE} />
        </div>
        <div className='name'>{item.name} {item.quantity > 1 ? `(${item.quantity})` : ''}</div>
        {item.description && <div className='description'>{item.description}</div>}
      </div>
    </div>}
    {editingModalOpen && <div className='modal open' onClick={closeEditing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Item</label>
          <input type='text' value={formValues.name} onChange={e => setFormValues({ ...formValues, name: e.target.value })} />
        </div>
        <div className='field'>
          <label>Amount</label>
          <input type='number' value={formValues.quantity} onChange={e => setFormValues({ ...formValues, quantity: Number(e.target.value) })} />
        </div>
        <div className='image field'>
          <label>Description</label>
          <textarea value={formValues.description} onChange={e => setFormValues({ ...formValues, description: e.target.value })} />
        </div>
        <div className='image field'>
          <label>Icon</label>
          <input type='file' onChange={e => setImage(e.target.files[0])} />
        </div>
        <div className='image-preview'>
          <img src={formValues.image || ITEM_IMAGE} />
        </div>
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
        </div>
      </div>
    </div>}
  </div>
}