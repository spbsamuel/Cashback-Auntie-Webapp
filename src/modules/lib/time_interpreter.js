import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'


export const getRelevantPairs = (dayTimeNow, timeArrays, buffer) => {
  if (timeArrays.length == 0) {
    return {}
  }
  else {
    for (let index = 0; index < timeArrays.length; index++) {
      const [startTime, endTime] = timeArrays[index].map(Number);
      if (startTime - buffer <= dayTimeNow && dayTimeNow < endTime) {
        return {current: [startTime, endTime]};
      }
      else if (dayTimeNow < startTime) {
        return {next: [startTime, endTime]}
      }
    }
    return {next: timeArrays[0].map((dayTimeStr) => Number(dayTimeStr) + 70000)}
  }
};

export const parseCustomUtcStringToLocalDateTime = (dayTimeStr, now) => {
  dayTimeStr = String(dayTimeStr);
  const day = dayTimeStr.length <= 4 ? 0 : parseInt(dayTimeStr.slice(0, -4));
  const utcDayNow = now.getUTCDay();
  const hour = dayTimeStr.slice(-4, -2);
  const minWithOffset = parseInt(dayTimeStr.slice(-2)) - now.getTimezoneOffset();
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - utcDayNow + day, hour, minWithOffset);
};

export const parseAndFormatDayTimeStrings = (dayTimeStrings, now) => {
  return dayTimeStrings.map((dayTimeStr) => {
    let time = parseCustomUtcStringToLocalDateTime(dayTimeStr, now);
    return format(time, 'h:mm a').replace(':00', '');
  });
};

export const generateTimeStatus = ({utcDayTimeNow, timeArrays, buffer, openText, closedText, nextText, todayDateTime}) => {
  let timePair = getRelevantPairs(parseInt(utcDayTimeNow), timeArrays, buffer);
  let timeInfo = {timeStatus: closedText, timeClass: 'default'};
  if (timePair.current) {
    let [start, end] = parseAndFormatDayTimeStrings(timePair.current, todayDateTime);
    timeInfo.timeStatus = `${openText}, ${start} to ${end}`;
    timeInfo.timeClass = 'open'
  }
  else if (timePair.next) {
    const startTime = parseCustomUtcStringToLocalDateTime(timePair.next[0], todayDateTime);
    const start = format(startTime, 'h:mm a').replace(':00', '');
    const today = todayDateTime;
    const daysLater = differenceInCalendarDays(startTime, today); // Calender vs full days ... weird
    if (daysLater == 0) {
      timeInfo.timeStatus = `${nextText}, ${start}`
    }
    else if (daysLater == 1) {
      timeInfo.timeStatus = `${nextText}, ${start} Tomorrow`
    }
    else if (daysLater > 1) {
      const dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      timeInfo.timeStatus = `${nextText}, ${start} ${dayStrings[startTime.getDay()]}`
    }
  }
  return timeInfo
};

export const generateDateStatus = (openingDate, closingDate, todayDateTime) => {
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
  return dateStatus
};
