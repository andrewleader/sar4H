import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';
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

const LatestMissions = (props: {
  membership: MembershipModel
}) => {
  const classes = useStyles();
  const [missions, setMissions] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      var result = await props.membership.getMissionsAsync({
        published: false
      });

      setMissions(result);
    }

    loadAsync();
  }, []);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <div className={classes.cardsContainer}>
      {missions.map((mission) => (
        <div className={classes.card} key={mission.id}>
          <ListItemMission mission={mission}/>
        </div>
      ))}
    </div>
  );
}

export default LatestMissions;