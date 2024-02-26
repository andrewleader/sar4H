import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { styled } from '@mui/material';

const StyledCardsContainer = styled('div')({
  margin: "24px"
});

const StyledCard = styled('div')({
  marginBottom: "24px"
});

const LatestMissions = (props: {
  membership: MembershipModel
}) => {
  const [missions, setMissions] = React.useState<ActivityListItemModel[] | undefined>(undefined);
  
  React.useEffect(() => {

    async function loadAsync() {
      var result = await props.membership.getMissionsAsync({
        published: false
      });
       
      setMissions(result);
    }

    loadAsync();
  }, []);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <StyledCardsContainer>
      {missions.map((mission) => (
        <StyledCard key={mission.id}>
          <ListItemMission mission={mission}/>
        </StyledCard>
      ))}
    </StyledCardsContainer>
  );
}

export default LatestMissions;