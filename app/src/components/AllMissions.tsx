import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IIncidentListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import MissionListItemModel from '../models/missionListItemModel';

const AllMissions = (props: {
  membership: MembershipModel
}) => {
  const [missions, setMissions] = React.useState<MissionListItemModel[] | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      var draftMissions = await props.membership.getMissionsAsync({
        published: false
      });

      var publishedMissions = await props.membership.getMissionsAsync({
        published: true
      });

      var missions: MissionListItemModel[] = [];
      publishedMissions.forEach((mission) => {
        missions.splice(0, 0, mission);
      });
      draftMissions.forEach((mission) => {
        if (mission.date) {
          missions.splice(0, 0, mission);
        }
      });

      setMissions(missions);
    }

    loadAsync();
  }, [props.membership]);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  return (
    <div>
      {missions.map((mission) => {
        return <ListItemMission indident={mission}/>
      })}
    </div>
  );
}

export default AllMissions;