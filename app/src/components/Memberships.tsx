import * as React from 'react';
import Api from '../api';

const Memberships = () => {
  const [data, setData] = React.useState<{
    error?: string;
    memberships?: any[]
  }>({});

  React.useEffect(() => {

    async function loadDataAsync() {
      try {
        var result = await Api.getAccountMembershipsAsync();
        var memberships:any[] = [];

        result.data.documents.forEach((doc: any) => {
          memberships.push({
            name: doc.unit.name,
            image: doc.unit.urls.image,
            token: doc.token
          });
        });

        setData({
          memberships: memberships
        });
      } catch (err) {
        setData({
          error: err.toString()
        });
      }
    }

    loadDataAsync();

  }, []);

  if (data.memberships) {
    if (data.memberships.length == 0) {
      return (
        <p>It seems you're not a member of any units.</p>
      )
    }

    return (
      <p>{JSON.stringify(data.memberships)}</p>
    )
  }

  if (data.error) {
    return (
      <p>{data.error}</p>
    )
  }

  return (
    <p>Loading...</p>
  )
}

export default Memberships;