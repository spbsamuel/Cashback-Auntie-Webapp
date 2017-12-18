export default (store) => ({
  path: 'recommend_card',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const RecommendCard = require('./containers/RecommendCardViewContainer').default;
      cb(null, RecommendCard);

    /* Webpack named bundle   */
    }, 'recommend_card_view');
  }
});
