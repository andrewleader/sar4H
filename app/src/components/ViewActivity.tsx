import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IActivityListItem, IMemberListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography, FormLabel, FormControlLabel, Switch } from '@material-ui/core';
import ActivityListItemModel, { ActivityType } from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';
import MembershipModel from '../models/membershipModel';
import MembershipController from '../controllers/membershipController';
import { observer } from 'mobx-react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "24px",
    background: "white",
    height: "100%"
  },
  date: {
    marginBottom: "24px"
  },
  description: {
    marginBottom: "24px",
    whiteSpace: "pre-line"
  },
  respondingSwitch: {
    marginBottom: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const ViewActivity = observer((props: {
  activity: ActivityListItemModel | undefined
}) => {
  const activity = props.activity;
  const isMission = activity?.isMission();
  const attending = activity?.attending || false;

  const classes = useStyles();

  activity?.loadAttendanceIfNeededAsync();



  const handleRespondingChange = async (event:any) => {
    if (event.target.checked) {
      await activity?.setAttendingAsync();
    } else {
      await activity?.removeAttendingAsync();
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        {activity?.title || "Loading..."}
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        {activity?.getFriendlyDate()}
      </Typography>

      <FormLabel component="legend">Are you {isMission ? 'responding' : 'attending'}?</FormLabel>
      <FormControlLabel
          control={<Switch checked={attending} onChange={handleRespondingChange} value="responding" disabled={activity?.loadingAttending} />}
          label={attending ? (isMission ? 'Responding' : 'Attending') : (isMission ? 'Not responding' : 'Not attending')}
          className={classes.respondingSwitch}
        />
      
      <Typography className={classes.description}>
        {activity?.description}
      </Typography>

      <Typography variant="h6">
        {isMission ? 'Responders' : 'Attendees'}
      </Typography>

      {activity?.attendance ? (
        activity?.attendance.map(i => {
          return <p key={i.member.id}>{i.member.name}</p>
        })
      ) : (
        <p>Loading...</p>
      )}
      
    </div>
  );
});

export default ViewActivity;