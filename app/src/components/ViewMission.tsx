import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IIncidentListItem, IMemberListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography, FormLabel, FormControlLabel, Switch } from '@material-ui/core';
import MissionListItemModel from '../models/missionListItemModel';
import { makeStyles } from '@material-ui/core';
import MembershipModel from '../models/membershipModel';

const useStyles = makeStyles(theme => ({
  root: {
    margin: "24px"
  },
  date: {
    marginBottom: "24px"
  },
  attendingSwitch: {
    marginBottom: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const ViewMission = (props: {
  membership: MembershipModel,
  mission: MissionListItemModel
}) => {
  let { path, url } = useRouteMatch();

  const classes = useStyles();

  const [attendingMembers, setAttendingMembers] = React.useState<IMemberListItem[] | undefined>(undefined);
  const [attending, setAttending] = React.useState<boolean>(false);

  React.useEffect(() => {

    async function loadAsync() {
      var members = await props.membership.getAttendingMembers(props.mission.id);
      setAttendingMembers(members);
    }

    loadAsync();
  }, [props.membership, props.mission]);

  const handleAttendingChange = (event:any) => {
    if (event.target.checked) {
      setAttending(true);
    } else {
      setAttending(false);
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        {props.mission.title}
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        {props.mission.date?.toString()}
      </Typography>

      <FormLabel component="legend">Are you attending?</FormLabel>
      <FormControlLabel
          control={<Switch checked={attending} onChange={handleAttendingChange} value="attending" />}
          label={attending ? 'Attending' : 'Not attending'}
          className={classes.attendingSwitch}
        />

      <Typography variant="h6">
        Attendees
      </Typography>

      {attendingMembers ? (
        attendingMembers.map(member => {
          return <p key={member.id}>{member.name}</p>
        })
      ) : (
        <p>Loading...</p>
      )}
      
    </div>
  );
}

export default ViewMission;