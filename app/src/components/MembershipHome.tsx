import * as React from 'react';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
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
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import NewIncidentContainer from './IncidentContainer';
import UpcomingMeetings from './UpcomingMeetings';
import PastMeetings from './PastMeetings';
import UpcomingTrainings from './UpcomingTrainings';
import PastTrainings from './PastTrainings';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column"
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
    marginBottom: "12px"
  },
  sectionHeader: {
    marginBottom: "12px"
  }
}));

const MembershipHome = (props: {
  membership: MembershipModel
}) => {
  const classes = useStyles();
  let { path, url } = useRouteMatch();
  let history = useHistory();

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
    }
 
    loadAsync();
  }, [props.membership]);

  const logOut = () => {
    Authorized.logOut();
  }

  const Home = () => {
    
    return (
      <div className={classes.cardsContainer}>
        <Typography variant="h4" className={classes.sectionHeader}>Missions</Typography>
        <div className={classes.card}>
          <ActiveMissionsCard count={activeMissions.list === undefined ? -1 : activeMissions.list.length} href={activeMissions.href}/>
        </div>
        <div className={classes.card}>
          <TopLevelCard text="View past missions" href={`${url}/missions`}/>
        </div>
        <Typography variant="h4" className={classes.sectionHeader} style={{marginTop: '24px'}}>Meetings</Typography>
        <div className={classes.card}>
          <TopLevelCard text="Upcoming meetings" href={`${url}/meetings/upcoming`}/>
        </div>
        <div className={classes.card}>
          <TopLevelCard text="Past meetings" href={`${url}/meetings/past`}/>
        </div>
        <Typography variant="h4" className={classes.sectionHeader} style={{marginTop: '24px'}}>Trainings</Typography>
        <div className={classes.card}>
          <TopLevelCard text="Upcoming trainings" href={`${url}/trainings/upcoming`}/>
        </div>
        <div className={classes.card}>
          <TopLevelCard text="Past trainings" href={`${url}/trainings/past`}/>
        </div>
        <Typography variant="h4" className={classes.sectionHeader} style={{marginTop: '24px'}}>New incident</Typography>
        <div className={classes.card}>
          <TopLevelCard text="Add new incident/mission" href={`${url}/incident`}/>
        </div>
        {/* We don't seem to use trainings... */}
        {/* <div className={classes.card}>
          <TopLevelCard text="Upcoming trainings" href={`${url}/trainings/upcoming`}/>
        </div> */}
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
          await props.membership.setAttendingAsync(activityIntNum, activity?.date, activity?.enddate);
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

  const goBack = () => {
    history.goBack();
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Route path={`${path}/:subitem`}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={goBack}>
              <ArrowBackIosIcon/>
            </IconButton>
          </Route>
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
          <UpcomingMeetings membership={props.membership}/>
        </Route>
        {/* Past meetings/trainings not working yet, so commenting those out */}
        {/* <Route path={`${path}/meetings/past`}>
          <PastMeetings membership={props.membership}/>
        </Route> */}
        <Route path={`${path}/trainings/upcoming`}>
          <UpcomingTrainings membership={props.membership}/>
        </Route>
        {/* <Route path={`${path}/trainings/past`}>
          <PastTrainings membership={props.membership}/>
        </Route> */}
        <Route path={`${path}/incident`}>
          <NewIncidentContainer membership={props.membership}/>
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