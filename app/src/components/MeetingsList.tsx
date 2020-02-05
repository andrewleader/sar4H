import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    margin: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const MeetingsList = (props: {
  missions?: ActivityListItemModel[]
}) => {

  const classes = useStyles();

  if (props.missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <div className={classes.cardsContainer}>
      {props.missions.map((mission) => {
        return (
          <div className={classes.card} key={mission.id}>
            <ListItemMission mission={mission}/>
          </div>
        )
      })}
    </div>
  );
}

export default MeetingsList;