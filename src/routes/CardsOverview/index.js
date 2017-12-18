export default (store) => ({
  path: 'card_overview',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CardsOverview = require('./containers/CardsOverviewContainer').default;
      cb(null, CardsOverview);

      /* Webpack named bundle   */
    }, 'card_overview');
  }
});
