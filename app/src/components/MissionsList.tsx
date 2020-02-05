import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IIncidentListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import MissionListItemModel from '../models/missionListItemModel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    margin: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const MissionsList = (props: {
  missions?: MissionListItemModel[]
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

export default MissionsList;