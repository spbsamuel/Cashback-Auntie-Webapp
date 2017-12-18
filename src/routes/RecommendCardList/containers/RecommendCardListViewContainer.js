import {connect} from 'react-redux';
import RecommendCardView from '../RecommendCardListView';
import {collatedCalculator} from '../selectors/card_recommendation';

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */


const mapActionCreators = {};

const mapStateToProps = (state, ownProps) => ({
  collatedCalculator: collatedCalculator(state),
  cards: state.entities.cards
});

export default connect(mapStateToProps, mapActionCreators)(RecommendCardView);
