import React from 'react'
import classes from './RecommendCardView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import {Tabs, Tab} from 'material-ui/Tabs';
import '../../../styles/core.scss';

export const RecommendCardView = ({categories}) => (
  <div className={classes.container}>
    {Object.keys(categories).map(key => <ActionBtn key={key} category={key}>{categories[key]}</ActionBtn>)}
  </div>
);

const ActionBtn = ({children, category}) =>
  <Link to={"/recommend_card/" + category}>
    <div className={classes.action_btn}>
      <strong>
        {children}
      </strong>
    </div>
  </Link>;

export default RecommendCardView
