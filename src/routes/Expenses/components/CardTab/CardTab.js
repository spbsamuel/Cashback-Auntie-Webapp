import React from 'react'
import classes from './CardTab.scss'
import cx from 'classnames'

import '../../../../styles/core.scss';

const toDecimal = (num) => parseFloat(Math.round(num * 100) / 100).toFixed(2);

export const CardTab = ({expensesByCard, relevantCardWrappers}) =>
  <div>
    {
      Object
        .keys(expensesByCard)
        .map(key =>
          <CardCashback expenses={expensesByCard[key]} key={key} cardId={key} CardWrapper={relevantCardWrappers[key]}/>
        )
    }
  </div>;

const CardCashback = ({CardWrapper,expenses}) => {
  console.log('hehe');
  return (
    <CardWrapper>
      <CreditCardExpenditure/>
    </CardWrapper>
  )
};

class CreditCardExpenditure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExpense: false
    }
  }

  toggleExpense = () => {
    const showExpense = !this.state.showExpense;
    this.setState({showExpense});
  };

  render() {
    const {cardInfo, expensesWithCashback, totalCardExpenditure, totalCashback} = this.props;
    if (!cardInfo) {
      return <div/>
    }
    return (
      <div>
        <div onClick={this.toggleExpense} className={cx("row middle-xs center-xs", classes.credit_card)}>
          <div className="col-xs-4 col-padding">
            <img className={classes.credit_card_image} src={cardInfo['card']['image']}/>
          </div>
          <div className="col-xs-8 col-padding">
            <p>
              Expense: $ {toDecimal(totalCardExpenditure)}
            </p>
            <p>
              Cashback: $ {toDecimal(totalCashback)}
            </p>
          </div>
          <div className="col-xs-6">
            <i className="material-icons">keyboard_arrow_down</i>
          </div>
        </div>
        <div className={cx(classes.expenses, {
          [classes.expenses_show]: this.state.showExpense,
          [classes.expenses_hide]: !this.state.showExpense
        })}>
          {Object.keys(expensesWithCashback).map(key => {
            const expense = expensesWithCashback[key];
            return <ExpenseCard {...expense} key={key}/>
          })}
        </div>
      </div>
    )
  }
}

const ExpenseCard = ({amount, cashback, category, cardCategory, description, dateOfPurchase}) => {
  const icon = {
    'DINING': 'cutlery',
    'ONLINE': 'laptop',
    'GROCERIES': 'shopping-cart',
    'BILLS': 'file-text',
  };
  const iconClass = icon[category] || 'tags';
  return (
    <div className={classes.expense_card}>
      <div className="row middle-xs">
        <div className="col-xs-3 text-center">
          <i className={"fa fa-2x fa-" + iconClass}/>
          <em>{cardCategory}</em>
        </div>
        <div className="col-xs-6">
          <p>
            {(new Date(dateOfPurchase)).toDateString()}
          </p>
          <p>
            {description}
          </p>
        </div>
        <div className="col-xs-3 text-right">
          <p>
            ${amount}
          </p>
          <p>
            -${cashback}
          </p>
        </div>
      </div>
    </div>
  )
};

export default CardTab
