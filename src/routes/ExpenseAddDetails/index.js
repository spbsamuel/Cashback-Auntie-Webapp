export default (store) => ({
  path: 'add_expense/:uuid/details',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ExpenseAddDetails = require('./containers/ExpenseAddDetailsContainer').default;
      cb(null, ExpenseAddDetails);

      /* Webpack named bundle   */
    }, 'expense_add_details');
  }
});
