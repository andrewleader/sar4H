import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';
import { Autocomplete, TextField } from '@mui/material';

const TrainingsReport = (props: {
  membership: MembershipModel
}) => {

  const [pastTrainings, setPastTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  React.useEffect(() => {

    async function loadAsync() {
      var resp = await props.membership.getPastTrainingsAsync();
      setAvailableTags(resp.tags);
      setPastTrainings(resp.trainings);
    }

    loadAsync();

  }, [props.membership]);

  if (pastTrainings === undefined) {
    return <p>Loading...</p>
  }

  let filteredTrainings = pastTrainings;

  if (selectedTags.length > 0) {
    filteredTrainings = filteredTrainings.filter(i => i.tags.some(t => selectedTags.includes(t)));
  }

  return (<div>
    <div>
      <Autocomplete
        multiple
        options={availableTags}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Tags"
            placeholder="Tags"
          />
        )}
        value={selectedTags}
        onChange={(event: any, newValue: string[]) => {
          setSelectedTags(newValue);
        }}/>
    </div>
    <ActivitiesList activities={filteredTrainings}/>
  </div>)
}

export default TrainingsReport;