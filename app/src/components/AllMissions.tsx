import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';
import MembershipModel from '../models/membershipModel';
import { IIncidentListItem } from '../api/responses';
import ListItemMission from './ListItemMission';

const AllMissions = (props: {
  membership: MembershipModel
}) => {
  const [missions, setMissions] = React.useState<IIncidentListItem[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      var draftMissions = await props.membership.getIncidentsAsync({
        published: 0
      });

      var publishedMissions = await props.membership.getIncidentsAsync({
        published: 1
      });

      var missions: IIncidentListItem[] = [];
      publishedMissions.data.forEach((mission) => {
        missions.splice(0, 0, mission);
      });
      draftMissions.data.forEach((mission) => {
        if (mission.date) {
          missions.splice(0, 0, mission);
        }
      });

      setMissions(missions);
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

export default AllMissions;