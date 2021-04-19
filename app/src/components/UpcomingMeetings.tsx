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

const UpcomingMeetings = (props: {
  membership: MembershipModel
}) => {

  const classes = useStyles();
  const [upcomingMeetings, setUpcomingMeetings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setUpcomingMeetings(await props.membership.getUpcomingMeetingsAsync());
    }

    loadAsync();

  });

  if (upcomingMeetings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={upcomingMeetings}/>
}

export default UpcomingMeetings;