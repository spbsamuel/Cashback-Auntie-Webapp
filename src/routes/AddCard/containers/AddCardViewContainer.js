import {connect} from 'react-redux';
import {updateExpense} from 'store/core_reducers/entitiesReducer';
import AddCardView from '../AddCardView';
// import getExpense from '../selectors/select_expense'

const mapActionCreators = {
  updateExpense
};

const mapStateToProps = (state, ownProps) => ({cards: state.entities.cards});

export default connect(mapStateToProps, mapActionCreators)(AddCardView);
