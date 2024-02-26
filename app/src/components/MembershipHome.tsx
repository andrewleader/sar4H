import * as React from 'react';
import { useParams, Route, useNavigate, Routes } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
import NewIncidentContainer from './IncidentContainer';
import UpcomingMeetings from './UpcomingMeetings';
import PastMeetings from './PastMeetings';
import UpcomingTrainings from './UpcomingTrainings';
import PastTrainings from './PastTrainings';
import GroupQuals from './GroupQuals';
import TrainingsReport from './TrainingsReport';
import { AppBar, Button, IconButton, Toolbar, Typography, styled } from '@mui/material';

const StyledRootContainer = styled('div')({
  height: "100%",
  flexGrow: 1,
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column"
});

const StyledMenuButton = styled(IconButton)({
  marginRight: 2,
});

const StyledTitle = styled(Typography)({
  flexGrow: 1,
});

const StyledCardsContainer = styled('div')({
  margin: "24px"
});

const StyledCard = styled('div')({
  marginBottom: "12px"
});

const StyledSectionHeader = styled(Typography)({
  marginBottom: "12px"
});

const MembershipHome = (props: {
  membership: MembershipModel
}) => {
  let navigate = useNavigate();

  const [activeMissions, setActiveMissions] = React.useState<{
    list?: ActivityListItemModel[];
    href: string;
  }>({
    href: `missions/active`
  });

  React.useEffect(() => {
    
    async function loadAsync() {
      var activeMissions = await props.membership.getActiveMissionsAsync();

      var href = `$missions`;
      if (activeMissions.length === 1) {
        href = 'missions/' + activeMissions[0].id.toString();
      } else if (activeMissions.length > 1) {
        href = `missions/active`;
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
      <StyledCardsContainer>
        <StyledSectionHeader variant="h4">Missions</StyledSectionHeader>
        <StyledCard>
          <ActiveMissionsCard count={activeMissions.list === undefined ? -1 : activeMissions.list.length} href={activeMissions.href}/>
        </StyledCard>
        <StyledCard>
          <TopLevelCard text="View past missions" href={`missions`}/>
        </StyledCard>
        <StyledSectionHeader style={{marginTop: '24px'}}>Meetings</StyledSectionHeader>
        <StyledCard>
          <TopLevelCard text="Upcoming meetings" href={`meetings/upcoming`}/>
        </StyledCard>
        <StyledCard>
          <TopLevelCard text="Past meetings" href={`meetings/past`}/>
        </StyledCard>
        <StyledSectionHeader style={{marginTop: '24px'}}>Trainings</StyledSectionHeader>
        <StyledCard>
          <TopLevelCard text="Upcoming trainings" href={`trainings/upcoming`}/>
        </StyledCard>
        <StyledCard>
          <TopLevelCard text="Past trainings" href={`trainings/past`}/>
        </StyledCard>
        <StyledCard>
          <TopLevelCard text="Trainings report" href={`trainings/report`}/>
        </StyledCard>
        <StyledCard>
          <TopLevelCard text="View group quals" href={`groupquals`}/>
        </StyledCard>
        <StyledSectionHeader style={{marginTop: '24px'}}>New incident</StyledSectionHeader>
        <StyledCard>
          <TopLevelCard text="Add new incident/mission" href={`incident`}/>
        </StyledCard>
        {/* We don't seem to use trainings... */}
        {/* <StyledCard>
          <TopLevelCard text="Upcoming trainings" href={`${url}/trainings/upcoming`}/>
        </div> */}
      </StyledCardsContainer>
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
    navigate(-1);
  }

  return (
    <StyledRootContainer>
      <AppBar position="static">
        <Toolbar>
          <Routes>
          <Route path={`:subitem`} element={
            <StyledMenuButton edge="start" color="inherit" onClick={goBack}>
              <ArrowBackIosNewIcon/>
            </StyledMenuButton>
          } />
          </Routes>
          <StyledTitle variant="h6">
            SAR4H
          </StyledTitle>
          <Button color="inherit" onClick={logOut}>Log out</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path={`missions/active`} element={<ActivitiesList activities={activeMissions.list}/>}/>
        <Route path={`missions/:activityId`} element={<ViewActivityHandler/>}/>
        <Route path={`missions`} element={<AllMissions membership={props.membership}/>}/>
        <Route path={`meetings/upcoming`} element={<UpcomingMeetings membership={props.membership}/>}/>
        {/* Past meetings/trainings not working yet, so commenting those out */}
        {/* <Route path={`${path}/meetings/past`} element={<PastMeetings membership={props.membership}/>}/> */}
        <Route path={`trainings/upcoming`} element={<UpcomingTrainings membership={props.membership}/>}/>
        {/* <Route path={`${path}/trainings/past`} element={<PastTrainings membership={props.membership}/>}/> */}
        <Route path={`incident`} element={<NewIncidentContainer membership={props.membership}/>}/>
        <Route path={`meetings/:activityId`} element={<ViewActivityHandler/>}/>
        <Route path={`trainings/report`} element={<TrainingsReport membership={props.membership}/>}/>
        <Route path={`groupquals`} element={<GroupQuals membership={props.membership}/>}/>
        <Route path={`/`} element={<Home/>}/>
      </Routes>
      {/* <LatestMissions membership={props.membership}/> */}
    </StyledRootContainer>
  );
}

export default MembershipHome;