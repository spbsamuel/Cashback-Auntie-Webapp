export default (store) => {
  function redirectLoggedInUser(nextState, replace, callback) {
    const state = store.getState();
    if (state.auth.get('user').get('isSignedIn')) replace('/');
    return callback()
  }

  return ({
    path: 'sign_in',
    onEnter: redirectLoggedInUser,
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        const Dashboard = require('./OnBoardingView').default;
        cb(null, Dashboard);

        /* Webpack named bundle   */
      }, 'onboarding_view');
    }
  })
}
