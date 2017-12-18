import HeaderLayout from './HeaderLayout';
import { injectReducer } from 'store/reducers';

export default (store) => {
  const reducer = require('modules/header').default;
  injectReducer(store, { key: 'navBar', reducer });
  return(HeaderLayout);
};
