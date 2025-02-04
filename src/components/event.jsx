import React, { useState, useEffect } from 'react'

import * as FLAGS from 'country-flag-icons/react/3x2'
import { FaSave } from 'react-icons/fa'

import { getCountry } from '../logic/countries'

const SKILLS = ['explorer', 'neophile', 'bondmaker', 'tactician']

const DEFAULT_FORM_VALUES = {
  location: '',
  event: '',
  date: new Date().toISOString().split('T')[0],
  skillPoints: SKILLS.map(skill => ({ skill, value: 0 }))
}

export default function Event ({ event, editable, save }) {
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const [viewingModalOpen, setViewingModalOpen] = useState(false)
  const adding = !event
  const [formValues, setFormValues] = useState(adding ? DEFAULT_FORM_VALUES : { location: event.location, event: event.event, date: event.date, skillPoints: event.skillPoints || DEFAULT_FORM_VALUES.skillPoints })

  const startEditing = () => {
    if (!editable) {
      setViewingModalOpen(true)
      return
    }
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

  const closeViewing = event => {
    setViewingModalOpen(false)
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
    {viewingModalOpen && <div className='modal open' onClick={closeViewing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Event</label>
          <span>{event.event}</span>
        </div>
        <div className='field'>
          <label>Location</label>
          <span>{event.location}</span>
        </div>
        <div className='field'>
          <label>Date</label>
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className='field'>
          <label>Skillpoints</label>
          <ul>
            {event.skillPoints.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>
      </div>
    </div>}
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
        {SKILLS
          .map(skill => ({ skill, value: formValues.skillPoints.find(skillPoint => skillPoint.skill === skill)?.value || 0 }))
          .map(({ skill, value }, i) => <div key={i} className='field'>
            <label>{skill}</label>
            <input type='number' value={value} onChange={e => {
              const skillPoints = [...formValues.skillPoints]
              skillPoints[i].value = Number(e.target.value)
              setFormValues({ ...formValues, skillPoints })
            }} />
          </div>
        )}
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
        </div>
      </div>
    </div>}
  </div>
}