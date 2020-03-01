import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IActivityListItem, IMemberListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography, FormLabel, FormControlLabel, Switch } from '@material-ui/core';
import ActivityListItemModel, { ActivityType } from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';
import MembershipModel from '../models/membershipModel';
import MembershipController from '../controllers/membershipController';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "24px",
    background: "white",
    // height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
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

  const classes = useStyles();

  const handleRespondingChange = async (event:any) => {
    // setUpdatingResponding(true);
    if (event.target.checked) {
      props.actions?.setAttending();
    } else {
      props.actions?.removeAttending();
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        {props.activity?.title || "Loading..."}
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        {props.activity?.getFriendlyDate()}
      </Typography>

      <FormLabel component="legend">Are you {isMission ? 'responding' : 'attending'}?</FormLabel>
      <FormControlLabel
          control={<Switch checked={props.isAttending} onChange={handleRespondingChange} value="responding" disabled={props.isLoadingIsAttending} />}
          label={props.isAttending ? (isMission ? 'Responding' : 'Attending') : (isMission ? 'Not responding' : 'Not attending')}
          className={classes.respondingSwitch}
        />
      
      <Typography className={classes.description}>
        {props.activity?.description}
      </Typography>

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
      
    </div>
  );
}

export default ViewActivity;