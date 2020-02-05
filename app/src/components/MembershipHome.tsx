import * as React from 'react';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import classes from '*.module.css';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import LatestMissions from './LatestMissions';
import ActiveMissionsCard from './ActiveMissionsCard';
import { IIncidentListItem } from '../api/responses';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    flexGrow: 1,
    backgroundColor: "#f5f5f5"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  cardsContainer: {
    margin: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const MembershipHome = (props: {
  membership: MembershipModel
}) => {
  const classes = useStyles();

  const [activeMissions, setActiveMissions] = React.useState<{
    count: number;
    href: string;
  }>({
    count: -1,
    href: '/activeMissions'
  });

  React.useEffect(() => {

    async function loadAsync() {
      var draftIncidents = await props.membership.getIncidentsAsync({
        published: 0
      });

      var activeMissions:IIncidentListItem[] = [];
      draftIncidents.data.forEach((incident) => {
        if (incident.enddate === undefined) {
          activeMissions.push(incident);
        }
      });

      var href = "/missions";
      if (activeMissions.length === 1) {
        href = activeMissions[0].id.toString();
      } else if (activeMissions.length > 1) {
        href = "/activeMissions";
      }

      setActiveMissions({
        count: activeMissions.length,
        href: href
      });
    }

    loadAsync();
  }, [props.membership]);

  const logOut = () => {
    Authorized.logOut();
  }

  return (
    <div className={classes.root}>
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

      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <ActiveMissionsCard count={activeMissions.count} href={activeMissions.href}/>
        </div>
      </div>
      {/* <LatestMissions membership={props.membership}/> */}
    </div>
  );
}

export default MembershipHome;