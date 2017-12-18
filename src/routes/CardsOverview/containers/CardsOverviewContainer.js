import {connect} from 'react-redux';
import {updateExpense} from 'store/core_reducers/entitiesReducer';
import CardsOverview from '../CardsOverviewView';

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  updateExpense
};

const mapStateToProps = (state, ownProps) => ({cards: state.entities.cards});

export default connect(mapStateToProps, mapActionCreators)(CardsOverview);
