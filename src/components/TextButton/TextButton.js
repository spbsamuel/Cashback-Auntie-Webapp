import React from 'react'
import classes from './TextButton.scss'
import cx from 'classnames'

export const TextButton = ({label, onClick, style, className}) =>
  <button style={style} className={cx(classes.text_button,className)} onClick={onClick}>
    {label}
  </button>;


export default TextButton;
