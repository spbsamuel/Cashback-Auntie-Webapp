export default (store) => ({
  path: 'expenses',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Expenses = require('./containers/ExpensesViewContainer').default;
      cb(null, Expenses);

    /* Webpack named bundle   */
    }, 'expenses_view');
  }
});
