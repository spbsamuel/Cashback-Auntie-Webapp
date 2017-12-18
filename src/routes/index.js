import DashboardRoute from './Dashboard';
import ExpensesRoute from './Expenses';
import RecommendCardRoute from './RecommendCard';
import RecommendCardListRoute from './RecommendCardList';
import CashbackBreakdownRoute from './CashbackBreakdown';
import CashbackProgressRoute from './CashbackProgress';
import AddExpenseRoute from './AddExpense';
import ChooseCardRoute from './ChooseCard'
import ExpenseAddDetails from './ExpenseAddDetails'
import StandardLayout from 'layouts/StandardLayout'
import OnBoardingRoute from './OnBoarding'
import AddCardRoute from './AddCard'
import CardsOverviewRoute from './CardsOverview'

export const createRoutes = (store) => {
  function requireAuth(nextState, replace, callback) {
    const state = store.getState();
    if (!state.auth.get('user').get('isSignedIn')) replace('/sign_in');
    return callback()
  }

  return ({
    path: '',
    childRoutes: [
      {
        path: '',
        component: StandardLayout,
        onEnter: requireAuth,
        childRoutes: [
          DashboardRoute(store),
          ExpensesRoute(store),
          RecommendCardRoute(store),
          CashbackBreakdownRoute(store),
          CashbackProgressRoute(store),
          AddExpenseRoute(store),
          ChooseCardRoute(store),
          ExpenseAddDetails(store),
          AddCardRoute(store),
          CardsOverviewRoute(store),
          RecommendCardListRoute(store)
        ]
      },
      OnBoardingRoute(store),
    ]
  })
};

export default createRoutes;
