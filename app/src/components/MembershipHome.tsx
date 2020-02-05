import * as React from 'react';
import { useParams, Switch, Route, useRouteMatch } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import classes from '*.module.css';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import LatestMissions from './LatestMissions';
import ActiveMissionsCard from './ActiveMissionsCard';
import { IActivityListItem, IMemberListItem, IAttendanceListItem } from '../api/responses';
import TopLevelCard from './TopLevelCard';
import AllMissions from './AllMissions';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';
import ViewActivity from './ViewActivity';
import MembershipController from '../controllers/membershipController';

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
  let { path, url } = useRouteMatch();

  const [upcomingMeetings, setUpcomingMeetings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  const [activeMissions, setActiveMissions] = React.useState<{
    list?: ActivityListItemModel[];
    href: string;
  }>({
    href: `${url}/missions/active`
  });

  React.useEffect(() => {

    async function loadAsync() {
      var activeMissions = await props.membership.getActiveMissionsAsync();

      var href = `${url}/missions`;
      if (activeMissions.length === 1) {
        href = url + '/missions/' + activeMissions[0].id.toString();
      } else if (activeMissions.length > 1) {
        href = `${url}/missions/active`;
      }

      setActiveMissions({
        list: activeMissions,
        href: href
      });

      setUpcomingMeetings(await props.membership.getUpcomingMeetingsAsync());
    }

    loadAsync();
  }, [props.membership]);

  const logOut = () => {
    Authorized.logOut();
  }

  const Home = () => {
    return (
      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <ActiveMissionsCard count={activeMissions.list === undefined ? -1 : activeMissions.list.length} href={activeMissions.href}/>
        </div>
        <div className={classes.card}>
          <TopLevelCard text="Upcoming meetings/events" href={`${url}/meetings/upcoming`}/>
        </div>
        <div className={classes.card}>
          <TopLevelCard text="Upcoming trainings" href={`${url}/trainings/upcoming`}/>
        </div>
      </div>
    );
  }

  const ViewActivityHandler = () => {
    let { activityId } = useParams();
    const activityIntNum = parseInt(activityId!);

    const [activity, setActivity] = React.useState<ActivityListItemModel | undefined>(undefined);
    const [attendance, setAttendance] = React.useState<IAttendanceListItem[] | undefined>(undefined);
    const [isAttending, setIsAttending] = React.useState<boolean>(false);
    const [isLoadingIsAttending, setIsLoadingIsAttending] = React.useState<boolean>(true);

    const loadAttendees = async () => {
      var attendance = await props.membership.getAttendanceAsync(activityIntNum);
      setIsAttending(attendance!.find(i => i.member.id === props.membership.getMemberId()) !== undefined);
      setIsLoadingIsAttending(false);
      setAttendance(attendance);
    }

    const reloadAttendees = () => {
      setAttendance(undefined);
      loadAttendees();
    }

    React.useEffect(() => {

      async function loadAsync() {
        setActivity(await props.membership.getActivityAsync(activityIntNum));

        loadAttendees();
      }
  
      loadAsync();
    }, [activityId]);

    var attendingMembers:IMemberListItem[] | undefined;
    if (attendance) {
      attendingMembers = [];
      attendance.forEach(i => attendingMembers!.push(i.member));
    }

    return <ViewActivity
      activity={activity}
      attendees={attendingMembers}
      isAttending={isAttending}
      isLoadingIsAttending={isLoadingIsAttending}
      actions={{
        setAttending: async () => {
          setIsLoadingIsAttending(true);
          setIsAttending(true);
          await props.membership.setAttendingAsync(activityIntNum);
          reloadAttendees();
        },
        removeAttending: async () => {
          setIsLoadingIsAttending(true);
          setIsAttending(false);
          await props.membership.removeAttendingAsync(activityIntNum, attendance!.find(i => i.member.id == props.membership.getMemberId())!.id);
          reloadAttendees();
        }
      }} />
  }

  const UpcomingMeetings = () => {
    if (upcomingMeetings === undefined) {
      return <p>Loading...</p>
    }

    return <ActivitiesList activities={upcomingMeetings}/>
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

      <Switch>
        <Route path={`${path}/missions/active`}>
          <ActivitiesList activities={activeMissions.list}/>
        </Route>
        <Route path={`${path}/missions/:activityId`} children={<ViewActivityHandler/>}/>
        <Route path={`${path}/missions`}>
          <AllMissions membership={props.membership}/>
        </Route>
        <Route path={`${path}/meetings/upcoming`}>
          <UpcomingMeetings/>
        </Route>
        <Route path={`${path}/meetings/:activityId`} children={<ViewActivityHandler/>}/>
        <Route exact path={path}>
          <Home/>
        </Route>
      </Switch>
      {/* <LatestMissions membership={props.membership}/> */}
    </div>
  );
}

export default MembershipHome;