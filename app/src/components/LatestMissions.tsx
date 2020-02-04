import * as React from 'react';
import Api from '../api';
import Authorized from './Authorized';

const LatestMissions = () => {
  const [missions, setMissions] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      var result = await Api.getIncedentsAsync({
        published: 1
      });

      setMissions(JSON.stringify(result));
    }

    // loadAsync();
    setMissions(Authorized.getToken()!);
  }, []);

  return (
    <p>Missions: {missions}</p>
  );
}

export default LatestMissions;