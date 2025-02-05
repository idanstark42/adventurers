import { useState } from 'react'
import { FaSave } from 'react-icons/fa'

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

const valueFromHistory = history => {
  console.log(history)
  if (!history || history.length === 0) {
    return 0
  }

  if (history[history.length - 1].value) {
    return history[history.length - 1].value
  }

  const lastValueIndex = history.findLastIndex(event => event.hasOwnProperty('value'))

  let value = lastValueIndex >= 0 ? history[lastValueIndex].value : 0

  for (let i = lastValueIndex + 1; i < history.length; i++) {
    value += history[i].add
  }
  return value
}

export default function Skill ({ name, history, editable, save }) {
  const [editingModalOpen, setEditingModalOpen] = useState(false)

  const value = valueFromHistory(history)
  const level = findLevel(value, SKILL_LEVELS[name])
  const pointsInLevel = value - SKILL_LEVELS[name][level]
  const totalPoints = SKILL_LEVELS[name][level + 1] - SKILL_LEVELS[name][level]
  const [formValues, setFormValues] = useState({ level, pointsInLevel, comment: '' })

  const startEditing = () => {
    if (!editable) {
      return
    }
    setEditingModalOpen(true)
  }

  const saveEdit = async () => {
    await save(data => {
      formValues.timestamp = Date.now()
      formValues.value = SKILL_LEVELS[name].reduce((total, level, index) => total + (index <= formValues.level ? level : 0), formValues.pointsInLevel)
      console.log(formValues)
      data.skills[name].push(formValues)
      return data
    })
    setEditingModalOpen(false)
  }

  const closeEditing = event => {
    setEditingModalOpen(false)
    event.stopPropagation()
  }

  return <>
    <div className='icon' style={{ backgroundImage: `url(${SKILL_ICONS[name]})` }} onClick={startEditing} />
    <div className='name'>{name}</div>
    <div className='meter'>
      <div className='progress' style={{ width: `${5 + pointsInLevel / totalPoints * 95}%`, backgroundColor: COLORS[name] }} />
    </div>
    <div className='points'>{pointsInLevel}/{totalPoints}</div>
    <div className='level'>lvl. {level + 1}</div>
    {editingModalOpen && <div className='modal open' onClick={closeEditing}>
      <div className='content' onClick={e => e.stopPropagation()}>
        <div className='field'>
          <label>Level</label>
          <input type='number' value={formValues.level + 1} onChange={e => setFormValues({ ...formValues, level: Number(e.target.value) - 1 })} min={1} max={SKILL_LEVELS[name].length} />
        </div>
        <div className='field'>
          <label>XP</label>
          <input type='number' value={formValues.pointsInLevel} onChange={e => setFormValues({ ...formValues, pointsInLevel: Number(e.target.value) })} min={0} max={totalPoints} />
        </div>
        <div className='field'>
          <label>Comment</label>
          <textarea value={formValues.comment} onChange={e => setFormValues({ ...formValues, comment: e.target.value })} />
        </div>
        <div className='actions'>
          <button onClick={() => saveEdit()}><FaSave />save</button>
        </div>
      </div>
    </div>}
  </>
}