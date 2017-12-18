import {connect} from 'react-redux';
import OnBoardingView from '../OnBoardingView';

/*  Object of action creators (can also be function that returns object).
 Keys will be passed as props to presentational components. Here we are
 implementing our wrapper around increment; the component doesn't care   */


const mapActionCreators = {};

const mapStateToProps = (state, ownProps) => ({

});

export default connect(mapStateToProps, mapActionCreators)(ExpensesView);
