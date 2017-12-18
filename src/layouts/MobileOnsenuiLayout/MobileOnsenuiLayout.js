import React from 'react';
import classes from './MobileOnsenuiLayout.scss';
import '../../styles/core.scss';

export const MobileOnsenuiLayout = ({ children }) => (
  <div className="container">
      {children}
  </div>
);

MobileOnsenuiLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default MobileOnsenuiLayout;
