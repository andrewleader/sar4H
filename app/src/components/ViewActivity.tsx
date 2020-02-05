import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IActivityListItem, IMemberListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography, FormLabel, FormControlLabel, Switch } from '@material-ui/core';
import ActivityListItemModel from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';
import MembershipModel from '../models/membershipModel';

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

const ViewActivity = (props: {
  membership: MembershipModel,
  activity: ActivityListItemModel
}) => {
  let { path, url } = useRouteMatch();

  const classes = useStyles();

  const [respondingMembers, setRespondingMembers] = React.useState<IMemberListItem[] | undefined>(undefined);
  const [responding, setResponding] = React.useState<boolean>(false);
  const [updatingResponding, setUpdatingResponding] = React.useState<boolean>(true);

  const loadAsync = async () => {
    var members = await props.membership.getAttendingMembers(props.activity.id);
    if (members.find(i => i.id == 6)) {
      setResponding(true);
    } else {
      setResponding(false);
    }
    setUpdatingResponding(false);
    setRespondingMembers(members);
  }

  React.useEffect(() => {
    loadAsync();
  }, [props.membership, props.activity]);

  const handleRespondingChange = async (event:any) => {
    setUpdatingResponding(true);
    if (event.target.checked) {
      // await props.membership.setAttendingAsync(props.mission.id);
      setResponding(true);
      loadAsync();
    } else {
      setResponding(false);
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        {props.activity.title}
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        {props.activity.getFriendlyDate()}
      </Typography>

      <FormLabel component="legend">Are you responding?</FormLabel>
      <FormControlLabel
          control={<Switch checked={responding} onChange={handleRespondingChange} value="responding" />}
          label={responding ? 'Responding' : 'Not responding'}
          className={classes.respondingSwitch}
        />
      
      <Typography className={classes.description}>
        {props.activity.description}
      </Typography>

      <Typography variant="h6">
        Responders
      </Typography>

      {respondingMembers ? (
        respondingMembers.map(member => {
          return <p key={member.id}>{member.name}</p>
        })
      ) : (
        <p>Loading...</p>
      )}
      
    </div>
  );
}

export default ViewActivity;