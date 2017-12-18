import {connect} from 'react-redux';
import {updateExpense} from 'store/core_reducers/entitiesReducer';
import ExpenseAddDetails from '../ExpenseAddDetails';
import {getExpense, cashbackByExpense} from '../selectors/select_expense';
import {applicableCategories, currentCategory} from 'selectors/category_options'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  updateExpense
};

const mapStateToProps = (state, ownProps) => ({
  ...getExpense(state, ownProps),
  cashback: cashbackByExpense(state, ownProps),
  applicableCategories: applicableCategories(state, ownProps),
  currentCategory: currentCategory(state, ownProps),

});

export default connect(mapStateToProps, mapActionCreators)(ExpenseAddDetails);
