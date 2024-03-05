import * as React from 'react';
import { IActivityListItem, IMemberListItem } from '../api/responses';
import ActivityListItemModel, { ActivityType } from '../models/activityListItemModel';
import { FormControlLabel, FormLabel, Switch, Typography, styled } from '@mui/material';

// Define styles using the styled utility function
const StyledRoot = styled('div')({
  padding: "24px",
  background: "white",
  // height: "100%",
  boxSizing: "border-box",
  overflowY: "auto",
});

const StyledDate = styled(Typography)({
  marginBottom: "24px",
});

const StyledDescription = styled(Typography)({
  marginBottom: "24px",
  whiteSpace: "pre-line",
});

const StyledRespondingSwitch = styled(FormControlLabel)({
  marginBottom: "24px",
});

const ViewActivity = (props: {
  activity: ActivityListItemModel | undefined,
  isAttending: boolean | undefined,
  isLoadingIsAttending: boolean,
  attendees: IMemberListItem[] | undefined,
  actions?: {
    setAttending: Function,
    removeAttending: Function
  }
}) => {
  const isMission = props.activity?.isMission();

  const handleRespondingChange = async (event:any) => {
    // setUpdatingResponding(true);
    if (event.target.checked) {
      props.actions?.setAttending();
    } else {
      props.actions?.removeAttending();
    }
  }

  return (
    <StyledRoot>
      <Typography variant="h5">
        {props.activity?.title || "Loading..."}
      </Typography>
      <StyledDate color="textSecondary">
        {props.activity?.getFriendlyDate()}
      </StyledDate>

      <FormLabel component="legend">Are you {isMission ? 'responding' : 'attending'}?</FormLabel>
      <StyledRespondingSwitch
          control={<Switch checked={props.isAttending} onChange={handleRespondingChange} value="responding" disabled={props.isLoadingIsAttending} />}
          label={props.isAttending ? (isMission ? 'Responding' : 'Attending') : (isMission ? 'Not responding' : 'Not attending')}
        />
      
      <StyledDescription>
        {props.activity?.description}
      </StyledDescription>

      <Typography variant="h6">
        {isMission ? 'Responders' : 'Attendees'}
      </Typography>

      {props.attendees ? (
        props.attendees.map(member => {
          return <p key={member.id}>{member.name}</p>
        })
      ) : (
        <p>Loading...</p>
      )}
      
    </StyledRoot>
  );
}

export default ViewActivity;