import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import entities from './core_reducers/entitiesReducer'
import {configure, authStateReducer} from "redux-auth";

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    auth: authStateReducer,
    router,
    entities,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
