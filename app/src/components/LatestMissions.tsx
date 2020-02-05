import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';

const LatestMissions = (props: {
  membership: MembershipModel
}) => {
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
    <div>
      {missions.map((mission) => {
        return <ListItemMission mission={mission}/>
      })}
    </div>
  );
}

export default LatestMissions;