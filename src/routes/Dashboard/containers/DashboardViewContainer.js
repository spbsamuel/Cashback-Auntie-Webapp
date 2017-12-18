import {connect} from 'react-redux';
import DashboardView from '../DashboardView';
import {totalExpenditure,totalCashback, concatExpenses} from 'selectors/expenses_metrics'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => ({totalExpense: totalExpenditure(state), totalCashback: totalCashback(state), concatExpenses: concatExpenses(state)});

export default connect(mapStateToProps)(DashboardView);
