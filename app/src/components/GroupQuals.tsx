import * as React from 'react';
import MembershipModel from '../models/membershipModel';

const GroupQuals = (props: {
  membership: MembershipModel
}) => {

  const [data, setData] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {

    async function loadAsync() {
      setData(await props.membership.getGroupQualsAsync());
    }

    loadAsync();

  });

  if (data === undefined) {
    return <p>Loading...</p>
  }

  return <p>{JSON.stringify(data)}</p>
}

export default GroupQuals;