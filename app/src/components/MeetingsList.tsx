import * as React from 'react';
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

const MeetingsList = (props: {
  missions?: ActivityListItemModel[]
}) => {

  if (props.missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <StyledCardsContainer>
      {props.missions.map((mission) => {
        return (
          <StyledCard key={mission.id}>
            <ListItemMission mission={mission}/>
          </StyledCard>
        )
      })}
    </StyledCardsContainer>
  );
}

export default MeetingsList;