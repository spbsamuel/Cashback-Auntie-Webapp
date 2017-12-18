import React from 'react'
import classes from './CashbackBreakdownView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import '../../../styles/core.scss';
import ocbc365 from '../assets/ocbc365.png';
import cimb from '../assets/cimbvisasignature.png';
import standchartsingpost from '../assets/standchartsingpost.png';
import dbsvisadebit from '../assets/dbsvisadebit.jpg';

const cards_spending = [
  {
    card_img: ocbc365,
    cashback_rates: '1-5%',
    cashback: 4
  },
  {
    card_img: cimb,
    cashback_rates: '1-5%',
    cashback: 4
  },
  {
    card_img: standchartsingpost,
    cashback_rates: '1-5%',
    cashback: 2
  },
  {
    card_img: dbsvisadebit,
    cashback_rates: '1-5%',
    cashback: 20
  }
];

export const CashbackBreakdownView = () => (
  <div className={classes.container}>
    <StatusCard
      name="Cashback"
      value="$ 10.00"
      color="#6FCF97"
    />
    {
      cards_spending.map((card) =>
        <CreditCardBreakdown {...card}/>
      )
    }
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

const CreditCardBreakdown = ({card_img, cashback_rates, cashback}) =>
  <div className="row middle-xs center-xs">
    <div className="col-xs-4 col-padding">
      <img className={classes.credit_card_image} src={card_img}/>
    </div>
    <div className="col-xs-8 col-padding">
      <p>
        Cashback: ${cashback}
      </p>
      <p>
        Cashback Rates: {cashback_rates}
      </p>
    </div>
  </div>;

export default CashbackBreakdownView
