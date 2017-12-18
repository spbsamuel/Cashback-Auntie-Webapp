import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';
import {persistStore, autoRehydrate} from 'redux-persist'
import localForage from 'localForage'
import ActionCable from 'actioncable';

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
  const socket = cable.subscriptions.create("ChatChannel", {
    id: "samuel",

    disconnected: function (e) {
      console.log('disconnected', e);
    },

    sendAction: function (action) {
      console.log('Action Sent');
      this.perform('send_action', {...action});
    }

  });
  const actionCableMiddleWare = store => {
    socket.connected = function () {
      console.log('connected');
      socket.sendAction({
        type: 'FETCH_CARDS_REQUEST',
        lastInitialised: new Date()
      });
      socket.sendAction({
        type: 'FETCH_USER_CARDS_REQUEST',
        lastInitialised: new Date()
      });
    };
    socket.received = function (data) {
      store.dispatch(data);
    };
    return( next => action => {
      if (action.type == 'UPDATE_EXPENSE') {
        console.log("Middleware triggered:", action);
        socket.sendAction(action);
      }
      next(action);
    })
  };
  const middleware = [thunk, actionCableMiddleWare, routerMiddleware(history)];
  // const middleware = [thunk, routerMiddleware(history)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  // const enhancers = [autoRehydrate()];
  const enhancers = [];
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  initialState = {};

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  // persistStore(store, {storage: localForage, blacklist: ['router', 'auth']});

  return store;
};
