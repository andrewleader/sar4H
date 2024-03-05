import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';

const UpcomingMeetings = (props: {
  membership: MembershipModel
}) => {

  const [upcomingMeetings, setUpcomingMeetings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setUpcomingMeetings(await props.membership.getUpcomingMeetingsAsync());
    }

    loadAsync();

  }, [props.membership]);

  if (upcomingMeetings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={upcomingMeetings}/>
}

export default UpcomingMeetings;