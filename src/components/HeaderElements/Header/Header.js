import React from 'react';
import classes from './Header.scss';
import EnhancedButton from 'material-ui/internal/EnhancedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Popover} from 'material-ui/Popover';
import logo from 'static/images/arthoplogo.png'
import cx from 'classnames'
import {Link} from 'react-router'
import SideMenu from '../SideMenu'


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: "#000000"
  },
  tabs: {
    backgroundColor: "#ffffff",
    selectedTextColor: "#000000",
    textColor: "rgba(0, 0, 0, 0.4)"
  },
  fontFamily: "Avenir-Medium, sans-serif"
});

EnhancedButton.defaultProps.disableTouchRipple = true;
EnhancedButton.defaultProps.disableFocusRipple = true;

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryDropdown: false,
      sideMenu: false,
      countryDropdownEl: null
    }
  }

  handleCountryDropDown = (state) => (event) => this.setState({
    countryDropdown: state,
    countryDropdownEl: event.currentTarget
  });

  handleSideMenu = (state) => () => this.setState({sideMenu: state});

  render() {
    const {selectCountry, path} = this.props;
    const {countryDropdown, sideMenu, countryDropdownEl} = this.state;
    return (

      <div className={classes.header_container}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <div className={cx("row", classes.desktop_menu)}>
              <div className={cx("col-sm-2", classes.home_btn)}>
                <Link to="/">
                  <img className={classes.arthop_logo} src={logo}/>
                </Link>
                <CountryDropDown
                  handleTouchTap={this.handleCountryDropDown(true)}
                  handleRequestClose={this.handleCountryDropDown(false)}
                  selectCountry={selectCountry}
                  open={countryDropdown}
                  anchorEl={countryDropdownEl}
                />
              </div>
              <div className="col-sm-10">
                <div className={classes.tab_menu}>
                  <TabMenu path={path} handleOpenMenu={this.handleSideMenu(true)}/>
                </div>
              </div>
            </div>
            <div className={classes.mobile_tab_menu}>
              <MobileTabMenu path={path}/>
            </div>
            <SideMenu state={sideMenu} handleCloseMenu={this.handleSideMenu(false)}/>
          </div>
        </MuiThemeProvider>
      </div>

    );
  }
}

const CountryDropDown = ({handleTouchTap, handleRequestClose, selectCountry, open, anchorEl}) =>
  <div>
    <FlatButton
      onTouchTap={handleTouchTap}
      label="SEA"
      labelPosition="before"
      icon={<i className="material-icons">expand_more</i>}
    />
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
      targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
      onRequestClose={handleRequestClose}
    >
      <Menu>
        <MenuItem primaryText="Singapore" onClick={selectCountry.bind(this, 'Singapore')}/>
        <MenuItem primaryText="Malaysia" onClick={selectCountry.bind(this, 'Malaysia')}/>
        <MenuItem primaryText="Jakarta" onClick={selectCountry.bind(this, 'Jakarta')}/>
        <MenuItem primaryText="Vietnam" onClick={selectCountry.bind(this, 'Vietnam')}/>
      </Menu>
    </Popover>
  </div>;

const TabMenu = ({path, handleOpenMenu}) =>
  <Tabs value={path}>
    <Tab style={{"textIndent": "25px"}} label="Home" value="/" containerElement={<Link to="/"/>}/>
    <Tab label="Editorials" value="/editorials" containerElement={<Link to="/editorials"/>}/>
    <Tab label="Art Events" value="/events" containerElement={<Link to="/events"/>}/>
    <Tab label="Art Spaces" value="/spaces" containerElement={<Link to="/spaces"/>}/>
    <Tab className={classes.inline_tab} icon={<i className="material-icons">menu</i>} label="More"
         value="/more" onActive={handleOpenMenu}/>
  </Tabs>;

const MobileTabMenu = ({path}) =>
  <Tabs value={path}>
    <Tab icon={<i className="material-icons">home</i>} value="/" containerElement={<Link to="/"/>}/>
    <Tab icon={<i className="material-icons">library_books</i>} value="/editorials"
         containerElement={<Link to="/editorials"/>}/>
    <Tab icon={<i className="material-icons">event</i>} value="/events" containerElement={<Link to="/events"/>}/>
    <Tab icon={<i className="material-icons">store_mall_directory</i>} value="/spaces"
         containerElement={<Link to="/spaces"/>}/>
    <Tab icon={<i className="material-icons">menu</i>} value="/more" containerElement={<Link to="/more"/>}/>
  </Tabs>;

export default Header;
