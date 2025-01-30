import { useState } from 'react'

import './skill.css'

import explorer from '../assets/Explorer.jpg'
import neophile from '../assets/Neophile.jpg'
import bondmaker from '../assets/Bondmaker.jpg'
import tactician from '../assets/Tactician.jpg'

const SKILL_ICONS = { explorer, neophile, bondmaker, tactician }

const COLORS = {
  explorer: '#235430',
  neophile: '#472354',
  bondmaker: '#d332c6',
  tactician: '#09122C'
}

const SKILL_LEVELS = {
  explorer: [0, 5, 15, 30, 50, 75, 100],
  neophile: [0, 5, 15, 30, 50, 75, 100],
  bondmaker: [0, 5, 15, 30, 50, 75, 100],
  tactician: [0, 5, 15, 30, 50, 75, 100]
}

const findLevel = (xp, levels) => Math.max(0, levels.findLastIndex(level => xp >= level))

export default function Skill ({ name, history, editable, save }) {
  const [editValue, setEditValue] = useState(history.reduce((total, { value }) => total + value, 0))
  const [editing, setEditing] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  const toggleEdit = () => {
    if (!editable) return
    setEditing(previousValue => {
      if (previousValue) {
        save(original => {
          original.skills[name] = (original.skills[name] || []).concat({ value: editValue, timestamp: Date.now() })
          return original
        })
      }
      return !previousValue
    })
  }

  const startDragging = event => {
    if (!editing) return
    setDragStart(event.touches[0].clientX)
  }

  const endDragging = event => {
    if (!editing) return
    setDragStart(null)
  }

  const handleDrag = event => {
    if (!editing) return
    const amount = -1 * (event.touches[0].clientX - dragStart)
    setEditValue(Math.round(Math.min(100, Math.max(0, value + amount))))
  }

  const level = findLevel(editValue, SKILL_LEVELS[name])
  const pointsInLevel = editValue - SKILL_LEVELS[name][level]
  const totalPoints = SKILL_LEVELS[name][level + 1] - SKILL_LEVELS[name][level]

  return <>
    <div className='icon' style={{ backgroundImage: `url(${SKILL_ICONS[name]})` }} />
    <div className='name'>{name}</div>
    <div className='meter' onClick={toggleEdit} onTouchMove={handleDrag} onTouchStart={startDragging} onTouchEnd={endDragging}>
      <div className='progress' style={{ width: `${5 + pointsInLevel / totalPoints * 95}%`, backgroundColor: COLORS[name] }} />
    </div>
    <div className='points'>{pointsInLevel}/{totalPoints}</div>
    <div className='level'>lvl. {level}</div>
  </>
}