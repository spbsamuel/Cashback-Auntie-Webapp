export default (store) => ({
  path: '/',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const DashboardView = require('./containers/DashboardViewContainer').default;
      cb(null, DashboardView);

    /* Webpack named bundle   */
    }, 'dashboard_view');
  }
});
