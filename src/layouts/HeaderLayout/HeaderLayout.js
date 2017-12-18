import React from 'react';
import Header from 'containers/HeaderContainer';
import classes from './HeaderLayout.scss';
import 'styles/core.scss';

const Footer = () => <div style={{width: '100%', height: '40px'}}></div>;

export const HeaderLayout = ({ children }) => (
  <div>
    <Header/>
      {children}
    <Footer/>
  </div>
);

HeaderLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default HeaderLayout;
