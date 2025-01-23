import React, { useState, useEffect } from 'react'

import * as FLAGS from 'country-flag-icons/react/3x2'
import { FaSave } from 'react-icons/fa'

import { getCountry } from '../logic/countries'

const DEFAULT_FORM_VALUES = {
  // current country
  location: '',
  event: '',
  date: new Date().toISOString().split('T')[0]
}

export default function Event ({ event, editable, save }) {
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const adding = !event
  const [formValues, setFormValues] = useState(adding ? DEFAULT_FORM_VALUES : { location: event.location, event: event.event, date: event.date })

  const startEditing = () => {
    if (!editable) return
    setEditingModalOpen(true)
  }

  const saveEdit = async () => {
    const country = await getCountry(formValues.location)
    await save(data => {
      formValues.country = country
      if (adding) {
        data.history.unshift(formValues)
      } else {
        Object.assign(event, formValues)
      }
      return data
    })
    if (adding) setFormValues(DEFAULT_FORM_VALUES)
    setEditingModalOpen(false)
  }

  const closeEditing = event => {
    setEditingModalOpen(false)
    event.stopPropagation()
  }

  const Flag = event?.country ? FLAGS[event.country] : React.Fragment

  return <div className={`event ${adding ? 'adding' : ''}`} onClick={startEditing}>
    {adding ? <span>Add Event</span> : <>
      <div className='location'>
        <Flag />
        <div className='location-name'>{event.location}</div>
      </div>
      <div className='event'>{event.event}</div>
      <div className='date'>{new Date(event.date).toLocaleDateString()}</div>
    </>}
    {editingModalOpen && <div className='modal open' onClick={closeEditing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Event</label>
          <input type='text' value={formValues.event} onChange={e => setFormValues({ ...formValues, event: e.target.value })} />
        </div>
        <div className='field'>
          <label>Location</label>
          <input type='text' value={formValues.location} onChange={e => setFormValues({ ...formValues, location: e.target.value })} />
        </div>
        <div className='field'>
          <label>Date</label>
          <input type='date' value={formValues.date} onChange={e => setFormValues({ ...formValues, date: e.target.value })} />
        </div>
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
        </div>
      </div>
    </div>}
  </div>
}