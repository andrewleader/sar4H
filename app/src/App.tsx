import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Authorized from './components/Authorized';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import LatestMissions from './components/LatestMissions';
import Memberships from './components/Memberships';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import MembershipHome from './components/MembershipHome';
import Util from './api/util';
import CookiesHelper from './helpers/cookiesHelper';
import MembershipModel from './models/membershipModel';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

var lastMembership = CookiesHelper.getCookie("lastMembership");
if (lastMembership && window.location.pathname.length <= 1) {
  window.location.pathname = lastMembership;
}

const App = () => {

  const classes = useStyles();

  const logOut = () => {
    Authorized.logOut();
  }

  return (
    <Authorized>
      <Router>
        <div className={classes.root}>
          <Switch>

            <Route path="/:unitId">
              <Membership/>
            </Route>

            <Route path="*">
              <AppBar position="static">
                <Toolbar>
                  <IconButton edge="start" className={classes.menuButton} color="inherit">
                    <MenuIcon/>
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    SAR4H
                  </Typography>
                  <Button color="inherit" onClick={logOut}>Log out</Button>
                </Toolbar>
              </AppBar>
          
              <Memberships />
            </Route>

          </Switch>

        </div>
      </Router>
    </Authorized>
  );
}

export default App;


const Membership = () => {
  
  let { unitId } = useParams();
  var membershipModel = MembershipModel.get(unitId!);
  if (membershipModel) {
    CookiesHelper.setCookie("lastMembership", unitId!, 365);
  }
  return <MembershipHome membership={membershipModel!}/>
}