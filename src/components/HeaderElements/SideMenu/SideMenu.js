import React from 'react';
import classes from './SideMenu.scss';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import cx from 'classnames'
import {Link} from 'react-router'

export const SideMenu = ({state, handleCloseMenu}) =>
    <Drawer
      docked={false}
      width={600}
      open={state}
      onRequestChange={handleCloseMenu}
      openSecondary={true}
    >
      <div className={classes.drawer}>
        <div className="row">
          <div className="col-xs-4">
            <FlatButton
              label="Home"
              secondary={true}
              icon={<i className="material-icons">home</i>}
            />
            <FlatButton
              label="Account"
              secondary={true}
              icon={<i className="material-icons">person</i>}
            />
            <button className={classes.text_button}>Download App</button>
            <div className={cx(classes.inline_child_buttons)}>
              <button className={classes.icon_button}><i className="fa fa-facebook"/></button>
              <button className={classes.icon_button}><i className="fa fa-instagram"/></button>
              <button className={classes.icon_button}><i className="fa fa-envelope-o"/></button>
            </div>
          </div>
          <div className="col-xs-4">
            <h3>
              Company
            </h3>
            <Link to="/about">
              <button className={classes.text_button}>About</button>
            </Link>
            <Link to="/contributors">
              <button className={classes.text_button}>Contribute</button>
            </Link>
            <Link to="/privacy_policy">
              <button className={classes.text_button}>Privacy Policy</button>
            </Link>
          </div>
          <div className="col-xs-4">
            <h3>
              Partners
            </h3>
            <Link to="/partners">
              <button className={classes.text_button}>Get On ArtHop</button>
            </Link>
            <Link to="/contact">
              <button className={classes.text_button}>Contact Us</button>
            </Link>
          </div>
        </div>
        {/*<MenuCard
          index={0}
          title={'Editorial'}
          description={'Read the latest scopes in our award winning editorial'}
          leftCol={[<button className={classes.text_button}>Featured</button>,
            <button className={classes.text_button}>Latest</button>,
            <button className={classes.text_button}>Hop List</button>]}
          rightCol={[<button className={classes.text_button}>Know your art</button>,
            <button className={classes.text_button}>#Artist under 30</button>]}
        />
        <MenuCard
          index={1}
          title={'Art Events'}
          description={'An interactive directory of art events'}
          leftCol={[<button className={classes.text_button}>Happening this week</button>,
            <button className={classes.text_button}>Opening Soon</button>,
            <button className={classes.text_button}>Closing Soon</button>]}
          rightCol={[<button className={classes.text_button}>Happening Now</button>,
            <button className={classes.text_button}>Receptions</button>]}
        />
        <MenuCard
          index={3}
          title={'Art Spaces'}
          description={'An interactive directory of art spaces'}
          leftCol={[
            <button className={classes.text_button}>Nearest spaces</button>,
            <button className={classes.text_button}>Art Studios</button>,
            <button className={classes.text_button}>Featured</button>
          ]}
          rightCol={[
            <button className={classes.text_button}>Open Now</button>,
            <button className={classes.text_button}>New Shows</button>
          ]}
        />*/}
      </div>
    </Drawer>
  ;

// const MenuCard = ({title, description, leftCol, rightCol}) =>
//   <div className={cx('row', classes.menu_container)}>
//     <div className="col-xs-5">
//       <h3>{title}</h3>
//       <div className={classes.sample_image}/>
//     </div>
//     <div className="col-xs-7">
//       <p>{description}</p>
//       <div className="row">
//         <div className="col-xs-6">
//           {leftCol}
//         </div>
//         <div className="col-xs-6">
//           {rightCol}
//         </div>
//       </div>
//     </div>
//   </div>;


export default SideMenu;
