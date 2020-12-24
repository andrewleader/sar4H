import * as React from 'react';
import Api from '../api';
import ListItemMembership from './ListItemMembership';
import CookiesHelper from '../helpers/cookiesHelper';

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
            id: doc.unit.id,
            image: doc.unit.urls.image,
            token: doc.token
          });

          CookiesHelper.setCookie("membership" + doc.unit.id, doc.token, 365);
          CookiesHelper.setCookie("membership" + doc.unit.id + "_memberId", doc.id, 365);
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
      <div>
        {data.memberships.map((membership: any) => {
          return <ListItemMembership key={membership.id} name={membership.name} id={membership.id}/>
        })}
      </div>
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