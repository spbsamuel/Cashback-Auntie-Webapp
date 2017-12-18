import React from 'react'

export const CreditCardCashback = ({className, ...props}) =>
  <div className={className}>
    {React.Children
      .map(props.children, (child) => React.cloneElement(child, {...props}))
    }
  </div>;

export default CreditCardCashback;
