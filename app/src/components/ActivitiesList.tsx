import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    padding: "24px",
    height: "100%",
    overflow: "auto"
  },
  card: {
    marginBottom: "24px"
  }
}));

const ActivitiesList = (props: {
  activities?: ActivityListItemModel[]
}) => {

  const classes = useStyles();

  if (props.activities === undefined) {
    return <p>Loading...</p>
  }

  return (
    <div className={classes.cardsContainer}>
      {props.activities.map((activity) => {
        return (
          <div className={classes.card} key={activity.id}>
            <ListItemMission mission={activity}/>
          </div>
        )
      })}
    </div>
  );
}

export default ActivitiesList;