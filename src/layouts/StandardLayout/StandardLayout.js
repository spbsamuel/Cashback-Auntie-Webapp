import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import '../../styles/core.scss';
import BottomMenu from 'components/BottomMenu'

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

export const ThemeHolderMenuLayout = ({children, ...props}) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="container">
      <div style={{height: 'calc(100% - 56px)', overflow: 'scroll'}}>
        {children}
      </div>
      <BottomMenu {...props}/>
    </div>
  </MuiThemeProvider>
);

export default ThemeHolderMenuLayout
