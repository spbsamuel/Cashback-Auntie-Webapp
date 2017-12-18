import {connect} from 'react-redux';
import {updateExpense} from 'store/core_reducers/entitiesReducer';
import ChooseCardView from '../ChooseCardView';
import getExpense from '../selectors/select_expense'
import {getUserCards} from 'selectors/user_cards'

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  updateExpense
};

const mapStateToProps = (state, ownProps) => ({...getExpense(state, ownProps), userCardInfo: getUserCards(state)});

export default connect(mapStateToProps, mapActionCreators)(ChooseCardView);
