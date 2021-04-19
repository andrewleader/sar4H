import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { makeStyles } from '@material-ui/core';
import ActivitiesList from './ActivitiesList';

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    margin: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const UpcomingTrainings = (props: {
  membership: MembershipModel
}) => {

  const classes = useStyles();
  const [upcomingTrainings, setUpcomingTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setUpcomingTrainings(await props.membership.getUpcomingTrainingsAsync());
    }

    loadAsync();

  });

  if (upcomingTrainings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={upcomingTrainings}/>
}

export default UpcomingTrainings;