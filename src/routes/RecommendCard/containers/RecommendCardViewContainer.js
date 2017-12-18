import {connect} from 'react-redux';
import RecommendCardView from '../RecommendCardView';

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */


const mapActionCreators = {};

const catList = {DINING: 'Dining',
  ONLINE: 'Online Purchases',
  GENERAL: 'General',
  ENTERTAINMENT: 'Entertainment',
  GROCERIES: 'Groceries',
  BILLS: 'Bills'};

const mapStateToProps = (state, ownProps) => ({
  categories: catList
});

export default connect(mapStateToProps, mapActionCreators)(RecommendCardView);
