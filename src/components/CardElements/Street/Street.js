import React from 'react'
import classes from './Street.scss'

export const Street = (props) => <p className={classes.Street} ><em>{props.children}</em></p>;

Street.defaultProps = {
  children: ''
};

Street.propTypes = {
  children: React.PropTypes.string.isRequired
};

export default Street
