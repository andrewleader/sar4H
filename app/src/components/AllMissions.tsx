import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IIncidentListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import MissionListItemModel from '../models/missionListItemModel';
import { useParams, Switch, Route, useRouteMatch } from 'react-router-dom';
import ViewMission from './ViewMission';

const AllMissions = (props: {
  membership: MembershipModel
}) => {
  const [missions, setMissions] = React.useState<MissionListItemModel[] | undefined>(undefined);
  let { path, url } = useRouteMatch();

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

  const ViewMissionHandler = () => {
    let { missionId } = useParams();

    var mission = missions.find(i => i.id.toString() === missionId);
    if (mission) {
      return <ViewMission membership={props.membership} mission={mission}/>
    } else {
      return <p>Loading...</p>
    }
  }

  return (
    <Switch>
      <Route path={`${path}/:missionId`} children={<ViewMissionHandler/>}/>
      <Route path={path}>
        <div>
          {missions.map((mission) => {
            return <ListItemMission mission={mission}/>
          })}
        </div>
      </Route>
    </Switch>
  );
}

export default AllMissions;