export default (store) => ({
  path: 'add_expense/:uuid/card',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ChooseCardView = require('./containers/ChooseCardViewContainer').default;
      cb(null, ChooseCardView);

      /* Webpack named bundle   */
    }, 'choose_card');
  }
});
