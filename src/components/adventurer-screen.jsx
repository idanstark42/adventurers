
import React, { useState } from 'react'
import { useLilo } from '../logic/lilo'
import { GiBookmarklet, GiOpenTreasureChest } from "react-icons/gi";

import EditableText from './editable-text'
import Stat from './stat'
import Avatar from './avatar'
import Event from './event'
import Item from './item'

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
    <EditableText className='name' name='name' editable={editable} save={save} value={data.name} />
    <Avatar editable={editable} save={save} value={data.image} />
    <EditableText className='bio' name='bio' editable={editable} save={save} value={data.bio} multiline />
    <div className='stats'>
      {Object.entries(data.stats).map(([name, history]) => <Stat key={name} name={name} history={history} editable={editable} save={save} />)}
    </div>
    <div className='tabs'>
      <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}><GiBookmarklet /> History</div>
      <div className={`tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}><GiOpenTreasureChest /> Inventory</div>
    </div>
    <div className={`tab-content history ${data.history.length === 0 ? 'empty' : ''} ${tab === 'history' ? 'active' : ''}`}>
    {editable && <Event event={null} editable={editable} save={save} />}
    {data.history.map((event, index) => <Event key={index} event={event} editable={editable} save={save} />)}
    </div>
    <div className={`tab-content inventory ${tab === 'inventory' ? 'active' : ''}`}>
      {data.inventory.map((item, index) => <Item key={index} item={item} editable={editable} save={save} />)}
      {editable && <Item event={null} editable={editable} save={save} />}
    </div>
    {children}
  </div>
}