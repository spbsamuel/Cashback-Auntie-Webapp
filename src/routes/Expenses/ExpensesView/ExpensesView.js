import React from 'react'
import classes from './ExpensesView.scss'
import cx from 'classnames'
import {Tabs, Tab} from 'material-ui/Tabs';
import '../../../styles/core.scss';
import CategoryTab from '../components/CategoryTab'
import CardTab from '../components/CardTab'

export const ExpensesView = ({
  cards,
  expenses,
  categories,
  totalExpense,
  expensesByCard,
  expensesByCategories,
  relevantCardWrappers
}) => (
  <div className={classes.container}>
    <StatusCard
      name="Total Spent"
      value={"$ " + totalExpense}
      color="#EAEAEA"
    />
    <Tabs>
      <Tab label="Credit Card">
        <CardTab expensesByCard={expensesByCard} relevantCardWrappers={relevantCardWrappers}/>
      </Tab>
      <Tab label="Category">
        {/*<CategoryTab expensesByCategories={expensesByCategories} categories={categories} cards={cards}/>*/}
      </Tab>
    </Tabs>
  </div>
);

const StatusCard = ({name, value, color}) =>
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

export default ExpensesView
