import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import { IIncidentListItem } from '../api/responses';
import ListItemMission from './ListItemMission';

const LatestMissions = (props: {
  membership: MembershipModel
}) => {
  const [missions, setMissions] = React.useState<IIncidentListItem[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      var result = await props.membership.getIncidentsAsync();

      setMissions(result.data);
    }

    loadAsync();
  }, []);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <div>
      {missions.map((mission: IIncidentListItem) => {
        return <ListItemMission indident={mission}/>
      })}
    </div>
  );
}

export default LatestMissions;