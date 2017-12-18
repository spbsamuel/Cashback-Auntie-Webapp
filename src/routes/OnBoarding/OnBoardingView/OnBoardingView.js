import React from 'react'
import classes from './OnBoardingView.scss'
import cx from 'classnames'
import {Tabs, Tab} from 'material-ui/Tabs';
import ThemeHolderLayout from 'layouts/ThemeHolderLayout'
import '../../../styles/core.scss';
import {EmailSignUpForm, EmailSignInForm} from "redux-auth/material-ui-theme";
import { OAuthSignInButton } from "redux-auth/material-ui-theme";
import {Link} from 'react-router'

export const OnBoardingView = ({history}) => {
  const {replace} = history;
  const goHome = () => replace('/');
  const goAddCard = () => replace('/add_card');
  return (
    <ThemeHolderLayout>
      <div className={classes.container}>
        <div>
          <h1>Cashback Auntie</h1>
          <p>Start the cashback</p>
        </div>
        <Tabs>
          <Tab label="New User">
            <EmailSignUpForm next={goAddCard}/>
          </Tab>
          <Tab label="Existing USer">
            <EmailSignInForm next={goHome}/>
            <div className={cx("row center-xs",classes.google_signin)}>
              <OAuthSignInButton provider="google" next={goHome}>Login with Google+</OAuthSignInButton>
            </div>
          </Tab>
        </Tabs>
      </div>
    </ThemeHolderLayout>
  )
};

export default OnBoardingView;
