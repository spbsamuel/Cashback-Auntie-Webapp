import {connect} from 'react-redux';
import {updateExpense} from 'store/core_reducers/entitiesReducer';
import AddExpenseView from '../AddExpenseView';
import getExpense from '../selectors/select_expense'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  updateExpense
};

const mapStateToProps = (state, ownProps) => ({
  expense: getExpense(state, ownProps),
  uuid: ownProps.params.uuid, ...ownProps
});

export default connect(mapStateToProps, mapActionCreators)(AddExpenseView);
