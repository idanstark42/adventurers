import { useState } from 'react'

import { useLilo } from '../logic/lilo'
import Backup from '../assets/avatar.jpg'

export default function Avatar ({ editable, save, value }) {
  const { uploadImage } = useLilo()

  const openUpload = () => {
    if (!editable) return
    const input = document.querySelector('.image input[type="file"]')
    input.click()
  }

  const closeUpload = async event => {
    const file = event.target.files[0]
    if (!file) return

    const response = await uploadImage(file)
    save(original => {
      original.image = response.result.url
      return original
    })
  }

  return <div className='image' onClick={openUpload} style={{ backgroundImage: `url(${Backup})` }}>
    <div className='overlay' style={{ backgroundImage: `url(${value})` }} />
    <input type='file' accept='image/*' onChange={event => closeUpload(event)} style={{ display: 'none' }} />
  </div>
}