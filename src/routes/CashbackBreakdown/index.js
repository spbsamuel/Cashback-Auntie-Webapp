export default (store) => ({
  path: 'cashback_earned',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CashbackBreakdown = require('./CashbackBreakdown').default;
      cb(null, CashbackBreakdown);

    /* Webpack named bundle   */
    }, 'cashback_breakdown_view');
  }
});
