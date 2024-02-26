import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import styled from '@emotion/styled';

const StyledCardsContainer = styled('div')({
  padding: "24px",
  height: "100%",
  overflow: "auto"
});

const StyledCard = styled('div')({
  marginBottom: "24px"
});

const ActivitiesList = (props: {
  activities?: ActivityListItemModel[]
  
}) => {
  
  if (props.activities === undefined) {
    return <p>Loading...</p>
  }
 
  return (
    <StyledCardsContainer>
      {props.activities.map((activity) => {
        return (
          <StyledCard key={activity.id}>
            <ListItemMission mission={activity}/>
          </StyledCard>
        )
      })}
    </StyledCardsContainer>
  );
}

export default ActivitiesList;