export default (store) => ({
  path: 'add_expense/:uuid',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AddExpenseView = require('./containers/AddExpenseViewContainer').default;
      cb(null, AddExpenseView);

    /* Webpack named bundle   */
    }, 'add_expense_view');
  }
});
