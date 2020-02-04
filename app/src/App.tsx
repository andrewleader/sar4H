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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {

  const classes = useStyles();

  const logOut = () => {
    Authorized.logOut();
  }

  return (
    <Authorized>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit">
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              SAR4H
            </Typography>
            <Button color="inherit" onClick={logOut}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Memberships />
      </div>
    </Authorized>
  );
}

export default App;
