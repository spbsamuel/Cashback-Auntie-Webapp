import React from 'react'
import classes from './LegacyCard.scss'
import cx from 'classnames'
import format from 'date-fns/format'
import {Link} from 'react-router'
import {Title, TimeStatus, DateStatus, Street, CardImage} from 'components/CardElements';

const DistanceInfo = ({distance, origin}) => {
  let metric = 'km';
  if (distance < 1){
    distance = parseInt(distance * 100)*10;
    metric = 'm';
  }
  else if (distance < 10){
    distance = String(distance).slice(0,3);
  }
  else{
    distance = parseInt(distance);
  }
  return <p className={classes.distance_info}>{distance} {metric} from {origin}</p>
};

const LegacyCard = ({
  className,
  linkPath,
  url_path,
  profile_image,
  name,
  street_name,
  detailed_timings,
  start_date,
  end_date,
  distance,
  origin
}) =>
  <div className={cx(className,classes.legacy_card)}>
    <Link to={`/${linkPath}/${url_path}`}>
      <CardImage
        src={profile_image}/>
      <div>
        <Title>{name}</Title>
        <Street>{street_name}</Street>
        {distance ?
          <DistanceInfo distance={distance} origin={origin}/>
          :
          ''
        }
        <TimeStatus
          utcDayTimeNow={format((new Date(new Date().toUTCString().substr(0, 25))), 'dHHmm')}
          todayDateTime={new Date()}
          timeArrays={detailed_timings}
          buffer={0}
          openText="Open Now"
          nextText="Opens at"
          closedText="Closed"
        />
        {start_date && end_date ?
          <DateStatus
            openingDate={new Date(start_date)}
            closingDate={new Date(end_date)}
            todayDateTime={new Date()}
          />
          :
          ''}
      </div>
    </Link>
  </div>;

export default LegacyCard
