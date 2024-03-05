import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { useParams, Routes, Route } from 'react-router-dom';
import ViewActivity from './ViewActivity';
import moment from "moment";
import { styled } from '@mui/material';

const StyledCardsContainer = styled('div')({
  margin: "24px"
});

const StyledCard = styled('div')({
  marginBottom: "24px"
});

const AllMissions = (props: {
  membership: MembershipModel
}) => {

  const [missions, setMissions] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {

      var draftMissions = await props.membership.getMissionsAsync({
        published: false,
      });

      var publishedMissions = await props.membership.getMissionsAsync({
        published: true,
        after: moment().subtract(2,'months').toISOString() // 2 months from today
      });

      var missions: ActivityListItemModel[] = [];

      publishedMissions.forEach((mission) => {
        missions.splice(0, 0, mission);

      });

      draftMissions.forEach((mission) => {
        if (mission.date) {
          missions.splice(0, 0, mission);
        }

      });


      setMissions(missions);

    }

    loadAsync();
  }, [props.membership]);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  const ViewMissionHandler = () => {
    let { missionId } = useParams();

    var mission = missions.find(i => i.id.toString() === missionId);
    if (mission) {
      return <p>Not implemented</p>
      // return <ViewActivity membership={props.membership} activity={mission}/>
    } else {
      return <p>Loading...</p>
    }
  }

  return (
    <Routes>
      <Route path={`$:missionId`} element={<ViewMissionHandler/>}/>
      <Route path="/" element={<StyledCardsContainer>
          {missions.map((mission) => (
            <StyledCard key={mission.id}>
              <ListItemMission mission={mission}/>

            </StyledCard>
          ))}
        </StyledCardsContainer>}/>
    </Routes>
  );
}

export default AllMissions;