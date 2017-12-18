export default (store) => ({
  path: 'add_card',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AddCardView = require('./containers/AddCardViewContainer').default;
      cb(null, AddCardView);

      /* Webpack named bundle   */
    }, 'add_card');
  }
});
