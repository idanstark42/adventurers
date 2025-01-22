import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'

export default function EditableText ({ className, value, editable, save, multiline }) {
  const [editValue, setEditValue] = useState(value)
  const [editing, setEditing] = useState(false)

  const toggleEdit = () => {
    if (!editable) return
    setEditing(previousValue => {
      if (previousValue) {
        save(original => ({ ...original, name: editValue }))
      }
      return !previousValue
    })
  }

  const handleKey = event => {
    if (event.key === 'Enter') {
      toggleEdit()
    }
  }

  return <div className={`${className} ${editing ? 'editing' : ''} editable-text`}>
    {editing && <>
        {multiline ? <textarea value={editValue} onChange={event => setEditValue(event.target.value)} onKeyDown={handleKey} />
        : <input type='text' value={editValue} onChange={event => setEditValue(event.target.value)} onKeyDown={handleKey} />}
        <FaCheck onClick={toggleEdit} />
    </>}
    {!editing && <span onClick={toggleEdit}>{editValue}</span>}
  </div>
}