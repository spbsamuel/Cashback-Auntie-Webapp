import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import '../../styles/core.scss';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: "#000000",
    primary1Color: "rgba(0, 0, 0, 0.4)"
  },
  tabs: {
    backgroundColor: "#ffffff",
    selectedTextColor: "#000000",
    textColor: "rgba(0, 0, 0, 0.4)"
  },
  fontFamily: "Avenir-Medium, sans-serif"
});
export const ThemeHolderLayout = ({children, ...props}) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="container">
      <div style={{height: '100%', overflow: 'scroll'}}>
        {children}
      </div>
    </div>
  </MuiThemeProvider>
);

ThemeHolderLayout.propTypes = {
  children: React.PropTypes.element
};

export default ThemeHolderLayout
