import React from 'react'
import classes from './DateStatus.scss'
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'

export const DateStatus = (props) => {
  const {openingDate, closingDate, todayDateTime} = props;
  const daysTillOpen = differenceInCalendarDays(openingDate, todayDateTime);
  const daysTillClose = differenceInCalendarDays(closingDate, todayDateTime);
  let dateStatus;
  if (daysTillOpen > 1) {
    dateStatus = `Opening on ${format(openingDate, 'Do MMM')}`;
  }
  else if (daysTillOpen == 0) {
    dateStatus = 'Opening Today';
  }
  else if (daysTillOpen == 1) {
    dateStatus = 'Opening Tomorrow';
  }
  else if (daysTillClose > 1) {
    dateStatus = `Ending on ${format(closingDate, 'Do MMM')}`;
  }
  else if (daysTillClose == 1) {
    dateStatus = 'Ending Tomorrow';
  }
  else if (daysTillClose == 0) {
    dateStatus = 'Ending Today';
  }
  else {
    dateStatus = 'Event Ended';
  }
  return <strong className={classes.DateStatus} >{dateStatus}</strong>
};
DateStatus.propTypes = {
  openingDate: React.PropTypes.instanceOf(Date).isRequired,
  closingDate: React.PropTypes.instanceOf(Date).isRequired,
  todayDateTime: React.PropTypes.instanceOf(Date).isRequired
};

export default DateStatus
