
import React, { useState } from 'react'
import { useLilo } from '../logic/lilo'
import { GiBookmarklet, GiFullWoodBucket, GiOpenTreasureChest, GiNotebook } from "react-icons/gi";

import NoOne from './no-one'
import Signup from './signup'

import EditableText from './editable-text'
import Stat from './stat'
import Skill from './skill'
import Avatar from './avatar'
import Event from './event'
import Item from './item'
import BucketlistItem from './bucketlist-item'
import LogoutButton from './logout-button'
import ShareButton from './share'
import SocialMediaLink from './social-media-link'

import './adventurer-screen.css'
import Loader from './loader';

export default function AdventurerScreen ({ editable=false, children }) {
  const { data, update, loading, userId } = useLilo()
  const [tab, setTab] = useState('bio')

  const save = async (callback) => {
    const newData = callback(data)
    delete newData._id
    await update({}, newData)
  }

  if (!data) {
    return <Loader />
  }

  if (!data) {
    const userIdFromURL = window.location.pathname.split('/').pop()
    if (userId && userId === userIdFromURL) {
      return <Signup />
    } else {
      return <NoOne />
    }
  }

  const skillHistory = (name, history) => {
    const relevantEvents = data.history
      .filter(event => event.skillPoints && event.skillPoints.length > 0 && event.skillPoints.some(skillPoint => skillPoint.skill === name))
      .map(event => ({ ...event, add: event.skillPoints.filter(skillPoint => skillPoint.skill === name)[0].value }))
    const allEvents = [...history, ...relevantEvents]
    allEvents.sort((a, b) => a.timestamp - b.timestamp)
    return allEvents
  }

  return <div className={`adventurer-screen ${editable ? 'editable' : ''}`}>
    <div className={`tab-content bio ${tab === 'bio' ? 'active' : ''}`}>
      <EditableText className='name' name='name' editable={editable} save={save} value={data.name} />
      <Avatar editable={editable} save={save} value={data.image} />
      <ShareButton title={data.name} text={data.bio} url={window.location.href} />
      <div className='links'>
        {data.socialLinks.map(link => <SocialMediaLink key={link} link={link} editable={editable} save={save} />)}
        {editable && <SocialMediaLink link={null} editable={editable} save={save} />}
      </div>
      <EditableText className='bio' name='bio' editable={editable} save={save} value={data.bio} multiline />
      <div className='stats'>
        {Object.entries(data.stats).sort(([name1], [name2]) => name1.localeCompare(name2)).map(([name, history]) => <Stat key={name} name={name} history={history} editable={editable} save={save} />)}
      </div>
      <div className='skills'>
        {Object.entries(data.skills).map(([name, history]) => <Skill key={name} name={name} history={skillHistory(name, history)} editable={editable} save={save} />)}
      </div>
    </div>
    <div className={`tab-content bucketlist ${tab === 'bucketlist' ? 'active' : ''}`}>
      <div className='title'>Bucket List</div>
      {data.bucketlist.map((item, index) => <BucketlistItem key={index} item={item} editable={editable} save={save} />)}
      {editable && <BucketlistItem event={null} editable={editable} save={save} />}
    </div>
    <div className={`tab-content history ${data.history.length === 0 ? 'empty' : ''} ${tab === 'history' ? 'active' : ''}`}>
      <div className='title'>History</div>
      {editable && <Event event={null} editable={editable} save={save} />}
      {data.history.map((event, index) => <Event key={index} event={event} editable={editable} save={save} />)}
    </div>
    <div className={`tab-content inventory ${tab === 'inventory' ? 'active' : ''}`}>
      <div className='title'>Inventory</div>
      {data.inventory.map((item, index) => <Item key={index} item={item} editable={editable} save={save} />)}
      {editable && <Item event={null} editable={editable} save={save} />}
    </div>
    <div className='tabs'>
      <div className={`tab ${tab === 'bio' ? 'active' : ''}`} onClick={() => setTab('bio')}><GiNotebook /></div>
      <div className={`tab ${tab === 'bucketlist' ? 'active' : ''}`} onClick={() => setTab('bucketlist')}><GiFullWoodBucket /></div>
      <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}><GiBookmarklet /></div>
      <div className={`tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}><GiOpenTreasureChest /></div>
      {userId && <div className='tab logout-button-container'><LogoutButton /></div>}
    </div>
    {children}
  </div>
}