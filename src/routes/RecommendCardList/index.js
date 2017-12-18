export default (store) => ({
  path: 'recommend_card/:category',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const RecommendCardListView = require('./containers/RecommendCardListViewContainer').default;
      cb(null, RecommendCardListView);

    /* Webpack named bundle   */
    }, 'recommend_list_view');
  }
});
