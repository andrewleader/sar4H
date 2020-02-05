import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IIncidentListItem, IMemberListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import MissionListItemModel from '../models/missionListItemModel';
import { makeStyles } from '@material-ui/core';
import MembershipModel from '../models/membershipModel';

const useStyles = makeStyles(theme => ({
  root: {
    margin: "24px"
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

  React.useEffect(() => {

    async function loadAsync() {
      var members = await props.membership.getAttendingMembers(props.mission.id);
      setAttendingMembers(members);
    }

    loadAsync();
  }, [props.membership, props.mission]);

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        {props.mission.title}
      </Typography>
      <Typography color="textSecondary">
        {props.mission.date?.toString()}
      </Typography>

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