import { useState } from 'react'

import './stat.css'

import Satiation from '../assets/Satiation.jpg'
import Health from '../assets/Health.jpg'
import Energy from '../assets/Energy.jpg'

const STAT_ICONS = { Satiation, Health, Energy }
const DEFAULT_STAT_RATE = 100 / (60 * 60 * 24)

export default function Stat ({ name, history, editable, save }) {
  const { value, lastUpdate } = history[history.length - 1]
  const [editValue, setEditValue] = useState(value - DEFAULT_STAT_RATE * (Date.now() - (lastUpdate || Date.now())) / 1000)
  const [editing, setEditing] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  const toggleEdit = () => {
    if (!editable) return
    setEditing(previousValue => {
      if (previousValue) {
        save(original => {
          original.stats[name] = (original.stats[name] || []).concat({ value: editValue, timestamp: Date.now() })
          return original
        })
      }
      return !previousValue
    })
  }

  const startDragging = event => {
    if (!editing) return
    setDragStart(event.touches[0].clientY)
  }

  const endDragging = event => {
    if (!editing) return
    setDragStart(null)
  }

  const handleDrag = event => {
    if (!editing) return
    const amount = -1 * (event.touches[0].clientY - dragStart)
    setEditValue(Math.round(Math.min(100, Math.max(0, value + amount))))
  }

  return <div className={`${editing ? 'editing' : ''} stat`} onClick={toggleEdit} onTouchMove={handleDrag} onTouchStart={startDragging} onTouchEnd={endDragging}>
    <div className='icon' style={{ backgroundImage: `url(${STAT_ICONS[name]})` }}>
      <div className='meter' style={{ height: `${100 - editValue}%` }} />
      <div className='value'>{Math.round(editValue)}%</div>
    </div>
    <div className='name'>{name}</div>
  </div>
}