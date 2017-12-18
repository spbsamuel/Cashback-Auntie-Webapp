import React from 'react'
import classes from './DashboardView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import uuidV4 from 'uuid/v4'
import {EmailSignInForm} from "redux-auth/material-ui-theme";


const toDecimal = (num) => parseFloat(Math.round(num * 100) / 100).toFixed(2);

export const DashboardView = (props) => {
  return (
    <div>
      {/*<EmailSignInForm/>*/}
      <TotalExpenditure totalExpense={props.totalExpense}/>
      <TotalCashback totalCashback={props.totalCashback}/>
      <CashbackRates totalExpense={props.totalExpense} totalCashback={props.totalCashback}/>
      <AddCharge push={props.history.push}/>
      <ActionBtn label="Recommend" path="/recommend_card"/>
    </div>
  )
};


const TotalCashback = ({totalCashback}) =>
  <StatusCard
    name="Cashback"
    value={"$ " + toDecimal(totalCashback)}
    color="#6FCF97"
    path=""
  />;

const CashbackRates = ({totalCashback, totalExpense}) =>
  <StatusCard
    name="Average %"
    value={toDecimal(totalCashback / totalExpense * 100) + "%"}
    color="#F2C94C"
    path=""
  />;

const TotalExpenditure = ({totalExpense}) =>
  <Link to={"/expenses"}>
    <div className={cx(classes.status_card, 'row', 'middle-xs')} style={{backgroundColor: "#EAEAEA"}}>
      <div className="col-xs-5">
        <h2>
          {"Total Spent"}:
        </h2>
      </div>
      <div className={cx(classes.field_value, "col-xs-6")}>
        <p>
          {"$ " + toDecimal(totalExpense)}
        </p>
      </div>
      <div className="col-xs-1">
        <i className="material-icons" style={{fontSize: '40px'}}>
          chevron_right
        </i>
      </div>
    </div>
  </Link>;

const StatusCard = ({name, value, color, path}) =>
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
  </div>;

const AddCharge = ({push}) => {
  const addNewExpense = () => {
    const path = '/add_expense/' + uuidV4();
    push(path)
  };
  return (
    <Link onClick={addNewExpense}>
      <div className={classes.action_btn}>
        <strong>
          Add Expense
        </strong>
      </div>
    </Link >
  )
};

const ActionBtn = ({label, path}) =>
  <Link to={path}>
    <div className={classes.action_btn}>
      <strong>
        {label}
      </strong>
    </div>
  </Link>;

export default DashboardView
