import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';


const PastTrainings = (props: {
  membership: MembershipModel
}) => {

  const [pastTrainings, setPastTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      // setPastTrainings(await props.membership.getPastTrainingsAsync());
    }

    loadAsync();

  }, [props.membership]);

  if (pastTrainings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={pastTrainings}/>
}

export default PastTrainings;