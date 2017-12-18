import React from 'react'
import classes from './TimeStatus.scss'
import cx from 'classnames'
import {generateTimeStatus} from 'modules/lib/time_interpreter'

export const TimeStatus = (props) => {
  const {timeStatus, timeClass} = generateTimeStatus(props);
  return(
    <strong className={cx(classes[timeClass],classes.TimeStatus)} >{timeStatus}</strong>
  )
};

TimeStatus.defaultPropTypes = {
  timeArrays: []
};

TimeStatus.propTypes ={
  utcDayTimeNow: React.PropTypes.string.isRequired,
  timeArrays: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(
      React.PropTypes.string.isRequired
    ).isRequired
  ).isRequired,
  buffer: React.PropTypes.number.isRequired,
  openText: React.PropTypes.string.isRequired,
  nextText: React.PropTypes.string.isRequired,
  todayDateTime: React.PropTypes.instanceOf(Date).isRequired
};

export default TimeStatus
