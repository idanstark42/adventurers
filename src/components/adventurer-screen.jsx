
import React, { useState } from 'react'
import { useLilo } from '../logic/lilo'

import Stat from './stat'
import Avatar from './avatar'

import './adventurer-screen.css'

export default function AdventurerScreen ({ editable=false, children }) {
  const { data, update } = useLilo()
  const [tab, setTab] = useState('history')

  const save = async (callback) => {
    const newData = callback(data)
    delete newData._id
    await update({}, newData)
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return <div className='adventurer-screen'>
    <div className='name'>{data.name}</div>
    <Avatar editable={editable} save={save} value={data.image} />
    <div className='bio'>{data.bio}</div>
    <div className='stats'>
      {data.stats.map(stat => <Stat key={stat.name} {...stat} editable save={save} />)}
    </div>
    <div className='tabs'>
      <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</div>
      <div className={`tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>Inventory</div>
    </div>
    <div className={`tab-content history ${data.history.length === 0 ? 'empty' : ''} ${tab === 'history' ? 'active' : ''}`}>
      {data.history.map(event => <div key={event.date} className='event'>
        <div className='date'>{event.date}</div>
        <div className='location'>{event.location}</div>
        <div className='event'>{event.event}</div>
      </div>)}
    </div>
    <div className={`tab-content inventory ${tab === 'inventory' ? 'active' : ''}`}>
      {data.inventory.map(item => <div key={item.name} className='item'>
        <div className='name'>{item.name}</div>
        <div className='quantity'>{item.quantity}</div>
        <div className='lifespan'>{item.lifespan}</div>
        <div className='equipped'>{item.equipped ? 'Equipped' : ''}</div>
      </div>)}
    </div>
    {children}
  </div>
}