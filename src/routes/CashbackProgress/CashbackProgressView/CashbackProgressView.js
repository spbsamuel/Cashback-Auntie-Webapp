import React from 'react'
import classes from './CashbackProgressView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import '../../../styles/core.scss';

export const CashbackProgressView = () => (
  <div className={classes.container}>
    <StatusCard
      name="Average %"
      value="1 - 5%"
      color="#F2C94C"
    />
  </div>
);

const StatusCard = ({name, value, color}) =>
  <Link>
    <div className={cx(classes.status_card, 'row')} style={{backgroundColor: color}}>
      <div className="col-xs-5">
        <h2>
          {name}:
        </h2>
      </div>
      <div className={cx(classes.field_value, "col-xs-7")}>
        <p>
          {value}
        </p>
      </div>
    </div>
  </Link>;

export default CashbackProgressView;
