import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './components/LogIn';
import Authorized from './components/Authorized';
import LatestMissions from './components/LatestMissions';
import Memberships from './components/Memberships';
import MenuIcon from '@mui/icons-material/Menu';
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
  Routes,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import MembershipHome from './components/MembershipHome';
import Util from './api/util';
import CookiesHelper from './helpers/cookiesHelper';
import MembershipModel from './models/membershipModel';
import { AppBar, Button, IconButton, Toolbar, Typography, styled } from '@mui/material';

const StyledRoot = styled('div')({
  height: "100%",
  flexGrow: 1
});

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)({
  flexGrow: 1,
});

var lastMembership = CookiesHelper.getCookie("lastMembership");
if (lastMembership && window.location.pathname.length <= 1) {
  window.location.pathname = lastMembership;
}

const App = () => {

  const logOut = () => {
    Authorized.logOut();
  }

  const router = createBrowserRouter([
    {
      path: "/:unitId/*",
      element: <Membership/>
    },
    {
      path: "/",
      element: (<div>
        <AppBar position="static">
                <Toolbar>
                  <StyledMenuButton edge="start" color="inherit">
                    <MenuIcon/>
                  </StyledMenuButton>
                  <StyledTitle variant="h6">
                    SAR4H
                  </StyledTitle>
                  <Button color="inherit" onClick={logOut}>Log out</Button>
                </Toolbar>
              </AppBar>
          
              <Memberships />
      </div>)
    }
  ])

  return (
    <Authorized>
      <RouterProvider router={router}/>
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