import React, { useState } from 'react'
import { FaSave, FaCheckSquare, FaRegSquare, FaPlus } from 'react-icons/fa'

const DEFAULT_FORM_VALUES = {
  objective: '',
  dateDone: null
}

export default function ({ item, editable, save }) {
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const adding = !item
  const done = !adding && item.dateDone
  const [formValues, setFormValues] = useState(adding ? DEFAULT_FORM_VALUES : { objective: item.objective, dateDone: item.dateDone })

  const handleClick = () => {
    if (!editable) return
    setEditingModalOpen(true)
  }

  const saveEdit = async () => {
    await save(data => {
      if (adding) {
        data.bucketlist.push(formValues)
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

  const markAsDone = async () => {
    await save(data => {
      item.dateDone = new Date().toISOString()
      return data
    })
    setEditingModalOpen(false)
  }

  return <div className={`bucketlist-item ${adding ? 'adding' : ''}`} onClick={handleClick}>
    {adding ? <><FaPlus /><span>Add Item</span></> : <>
      <div className='icon'>{done ? <FaCheckSquare /> : <FaRegSquare />}</div>
      <div className='objective'>{item.objective}</div>
    </>}
    {editingModalOpen && <div className='modal open' onClick={closeEditing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Objective</label>
          <input type='text' value={formValues.objective} onChange={e => setFormValues({ ...formValues, objective: e.target.value })} />
        </div>
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
          <button onClick={() => markAsDone()}><FaCheckSquare />mark as done</button>
        </div>
      </div>
    </div>}
  </div>
}