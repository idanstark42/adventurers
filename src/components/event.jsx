import React, { useState } from 'react'

import * as FLAGS from 'country-flag-icons/react/3x2'
import { useEffect } from 'react'

export default function Event ({ event, editable, save }) {
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationValue, setLocationValue] = useState(event.location)
  const [countryValue, setCountryValue] = useState(event.country)

  const Flag = event.country ? FLAGS[event.country] : React.Fragment
  return <div key={event.date} className='event'>
  <div className='location' onClick={() => editable && openLocationEdit()}>
    <Flag />
    <div className='location-name'>{event.location}</div>
  </div>
  <div className='event'>{event.event}</div>
  <div className='date'>{event.date}</div>
  </div>
}