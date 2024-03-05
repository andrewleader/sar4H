import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';

const UpcomingTrainings = (props: {
  membership: MembershipModel
}) => {

  const [upcomingTrainings, setUpcomingTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setUpcomingTrainings(await props.membership.getUpcomingTrainingsAsync());
    }

    loadAsync();

  }, [props.membership]);

  if (upcomingTrainings === undefined) {
    return <p>Loading...</p>
  }

  return <ActivitiesList activities={upcomingTrainings}/>
}

export default UpcomingTrainings;