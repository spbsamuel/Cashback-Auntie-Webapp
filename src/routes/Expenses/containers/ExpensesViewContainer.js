import {connect} from 'react-redux';
import ExpensesView from '../ExpensesView';
import {totalExpenditure, groupByCard, groupByCategory, collateExpenses, expensesByCategories} from 'selectors/expenses_metrics'
import {relevantCardWrappers} from 'selectors/user_cards'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const categories = {
  DINING: 'Dining',
  ONLINE: 'Online Purchases',
  GENERAL: 'General',
  ENTERTAINMENT: 'Entertainment',
  GROCERIES: 'Groceries',
  BILL: 'Bills'};

const mapActionCreators = {};


const mapStateToProps = (state, ownProps) => ({
  cards: state.entities.cards,
  expenses: collateExpenses(state),
  categories,
  totalExpense: totalExpenditure(state),
  expensesByCard: groupByCard(state),
  expensesByCategory: groupByCategory(state, categories),
  expensesByCategories: expensesByCategories(state),
  relevantCardWrappers: relevantCardWrappers(state)
});

export default connect(mapStateToProps, mapActionCreators)(ExpensesView);
