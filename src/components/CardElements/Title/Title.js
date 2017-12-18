import React from 'react';
import classes from './Title.scss';

export const Title = (props) => <h3 className={classes.Title}>{props.children}</h3>;

Title.propTypes = {
  children: React.PropTypes.string.isRequired
};

export default Title;
