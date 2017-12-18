export default (store) => ({
  path: 'cashback_progress',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Dashboard = require('./CashbackProgressView').default;
      cb(null, Dashboard);

    /* Webpack named bundle   */
    }, 'cashback_progress_view');
  }
});
