import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-navbox">Description</div>
        <div className='descriptionbox-navbox fade'>Reviews (122)</div>
      </div>
      <div className='descriptionbox-description'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, modi architecto vel facilis quod iusto ex aliquam rerum consectetur quisquam beatae amet, hic consequuntur culpa, animi optio! Libero, ea quidem.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt voluptates eius hic, omnis commodi eum dolores accusantium impedit. Fugiat, totam sed! Sapiente, at voluptates. Corrupti quis reiciendis provident delectus. Illum!</p>
      </div>
    </div>
  )
}

export default DescriptionBox
