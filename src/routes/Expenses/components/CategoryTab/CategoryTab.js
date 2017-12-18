import React from 'react'
import classes from './CategoryTab.scss'
import cx from 'classnames'
import '../../../../styles/core.scss';

const toDecimal = (num) => parseFloat(Math.round(num * 100) / 100).toFixed(2);

export const CategoryTab = ({expensesByCategories, categories, cards}) =>
  <div>
    {
      Object
        .keys(expensesByCategories)
        .map(key =>
          <CategoryExpenditure key={key} cards={cards} name={categories[key]} expenses={expensesByCategories[key]}/>
        )
    }
  </div>;

class CategoryExpenditure extends React.Component {
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
    const {name, expenses, cards} = this.props;
    return (
      <div>
        <div onClick={this.toggleExpense} className={cx("row middle-xs center-xs", classes.credit_card)}>
          <div className="col-xs-4 col-padding">
            <strong>
              {name}
            </strong>
          </div>
          <div className="col-xs-8 col-padding">
            <p>
              Expense: ${expenses ? expenses.reduce((sum, expense) => expense['amount'] + sum, 0) : 0}
            </p>
            <p>
              Cashback: ${expenses ? toDecimal(expenses.reduce((sum, expense) => expense['cashback'] + sum, 0)) : 0}
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
          {expenses
            .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
            .map(expense => {
            return <ExpenseCard {...expense} cardImage={cards[expense['card']]['image']} key={expense['uuid']}/>
          })}
        </div>
      </div>
    )
  }
}


const ExpenseCard = ({amount, cashback, description, createdAt, cardImage}) => {
  return (
    <div className={classes.expense_card}>
      <div className="row middle-xs">
        <div className="col-xs-3 text-center">
          <img className={classes.credit_card_image} src={cardImage}/>
        </div>
        <div className="col-xs-6">
          <p>
            {(new Date(createdAt)).toDateString()}
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

export default CategoryTab
