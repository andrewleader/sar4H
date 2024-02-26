import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';

const TrainingsReport = (props: {
  membership: MembershipModel
}) => {

  const [pastTrainings, setPastTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);

  React.useEffect(() => {

    async function loadAsync() {
      var resp = await props.membership.getPastTrainingsAsync();
      setPastTrainings(resp.trainings);
      setAvailableTags(resp.tags);
    }

    loadAsync();

  }, [props.membership]);

  if (pastTrainings === undefined) {
    return <p>Loading...</p>
  }

  return (<div>
    <div>{JSON.stringify(availableTags)}</div>
    <div></div>
    <ActivitiesList activities={pastTrainings}/>
  </div>)
}

export default TrainingsReport;