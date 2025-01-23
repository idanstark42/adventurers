
import React, { useState } from 'react'
import { useLilo } from '../logic/lilo'
import { GiBookmarklet, GiOpenTreasureChest } from "react-icons/gi";

import EditableText from './editable-text'
import Stat from './stat'
import Avatar from './avatar'
import Event from './event'

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

  return <div className={`adventurer-screen ${editable ? 'editable' : ''}`}>
    <EditableText className='name' editable={editable} save={save} value={data.name} />
    <Avatar editable={editable} save={save} value={data.image} />
    <EditableText className='bio' editable={editable} save={save} value={data.bio} multiline />
    <div className='stats'>
      {data.stats.map(stat => <Stat key={stat.name} {...stat} editable save={save} />)}
    </div>
    <div className='tabs'>
      <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}><GiBookmarklet /> History</div>
      <div className={`tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}><GiOpenTreasureChest /> Inventory</div>
    </div>
    <div className={`tab-content history ${data.history.length === 0 ? 'empty' : ''} ${tab === 'history' ? 'active' : ''}`}>
      {data.history.map((event, index) => <Event key={index} event={event} editable save={save} />)}
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