import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';

const PastMeetings = (props: {
  membership: MembershipModel
}) => {

  const [pastMeetings, setPastMeetings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setPastMeetings(await props.membership.getPastMeetingsAsync());
    }

    loadAsync();

  });

  if (pastMeetings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={pastMeetings}/>
}

export default PastMeetings;