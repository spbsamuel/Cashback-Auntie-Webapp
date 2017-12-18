import React from 'react'
import classes from './CoverImage.scss'
import image_shell from '../assets/image_shell.jpg'

const CardImage = ({src}) =>
  <div className={classes.card_image}>
    <img
      src={src}
      onError={(e) => e.target.src = image_shell}
      onLoad={(e) => e.target.className = classes.loaded}
    />
  </div>;


export default CardImage
