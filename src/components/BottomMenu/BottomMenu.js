import React from 'react';
import classes from './BottomMenu.scss';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {SignOutButton} from "redux-auth/material-ui-theme";
import Drawer from 'material-ui/Drawer';
import uuidV4 from 'uuid/v4'

class BottomMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    const {location, history} = this.props;
    let currentIndex = '';
    const {pathname} = location || {pathname: ''};
    if (pathname === '/') {
      currentIndex = 0;
    } else if (pathname.indexOf('/recommend_card') === 0) {
      currentIndex = 1;
    } else if (pathname.indexOf('/add_expense') === 0) {
      currentIndex = 2;
    }
    const goHome = () => {
      if (pathname !== '/') {
        history.push('/');
      }
    };
    const goLogin = () => {
      history.replace('/sign_in');
    };
    const goRecommendCard = () => {
      if (pathname !== '/recommend_card') {
        history.push('/recommend_card');
      }
    };
    const goAddExpense = () => {
      if (pathname.indexOf('/add_expense') !== 0 || pathname.indexOf('/details') > 0) {
        history.push('/add_expense/' + uuidV4())
      }
    };

    return (
      <div className={classes.fixed_bottom}>
        <BottomNavigation selectedIndex={currentIndex}>
          <BottomNavigationItem
            label="Dashboard"
            icon={<i className="material-icons">home</i>}
            onTouchTap={goHome}
          />
          <BottomNavigationItem
            label="Recommend"
            icon={<i className="material-icons">thumb_up</i>}
            onTouchTap={goRecommendCard}
          />
          <BottomNavigationItem
            label="Expense"
            icon={<i className="material-icons">payment</i>}
            onTouchTap={goAddExpense}
          />
          <BottomNavigationItem
            label="More"
            icon={<i className="material-icons">menu</i>}
            onTouchTap={this.handleToggle}
          />
        </BottomNavigation>
        <Drawer
          docked={false}
          openSecondary={true}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <SignOutButton next={goLogin}/>
        </Drawer>
      </div>
    )
  }
}

export default BottomMenu;
