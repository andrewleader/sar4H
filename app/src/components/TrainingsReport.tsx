import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem, IGroupListItem, IMember, IMemberListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import ActivitiesList from './ActivitiesList';
import { Autocomplete, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import moment, { Moment } from "moment";
import { DatePicker } from '@mui/x-date-pickers';

const TrainingsReport = (props: {
  membership: MembershipModel
}) => {

  const currentDate = moment();
  const getLastMarchFirst = (currentDate:Moment) => {
    if (currentDate.month() < 2) {
      return moment({
        year: currentDate.year() - 1,
        month: 2,
        date: 1
      });
    }
    return moment({
      year: currentDate.year(),
      month: 2,
      date: 1
    });
  }
  const lastMarchFirst = getLastMarchFirst(currentDate);

  const [availableGroups, setAvailableGroups] = React.useState<IGroupListItem[] | undefined>();
  const [selectedGroup, setSelectedGroup] = React.useState<IGroupListItem | undefined>();
  const [groupMembers, setGroupMembers] = React.useState<IMember[] | undefined>();
  const [attendances, setAttendances] = React.useState<string | undefined>();
  const [pastTrainings, setPastTrainings] = React.useState<ActivityListItemModel[] | undefined>(undefined);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [runningReport, setRunningReport] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Moment>(lastMarchFirst);
  const [endDate, setEndDate] = React.useState<Moment>(currentDate.startOf('day'));
  const [minimumHoursPerTag, setMinimumHoursPerTag] = React.useState<Map<string, number>>(new Map<string, number>())

  React.useEffect(() => {

    async function loadAsync() {
      setAvailableGroups(await props.membership.getGroupsAsync());
      var resp = await props.membership.getPastTrainingsAsync();
      setAvailableTags(resp.tags);
      setPastTrainings(resp.trainings);
    }

    loadAsync();

  }, [props.membership]);

  React.useEffect(() => {

    async function loadAsync() {
      if (selectedGroup) {
        var members = await props.membership.getMembersAsync({
          group_id: selectedGroup.id,
          include_details: false
        });
        setGroupMembers(members);
      }
    }

    setGroupMembers(undefined);
    loadAsync();

  }, [selectedGroup])

  if (availableGroups === undefined) {
    return <p>Loading...</p>
  }

  if (pastTrainings === undefined) {
    return <p>Loading...</p>
  }

  let filteredTrainings = pastTrainings.filter(t => moment(t.date).isSameOrAfter(startDate) && moment(t.date).endOf('day').isSameOrBefore(endDate));

  if (selectedTags.length > 0) {
    filteredTrainings = filteredTrainings.filter(i => i.tags.some(t => selectedTags.includes(t)));
  }
  
  const runReport = async () => {
    setRunningReport(true);
    await props.membership.bulkLoadAttendances(filteredTrainings);
    setRunningReport(false);
  }

  let body:React.ReactNode|undefined = undefined;

  let hasUnloadedAttendances = filteredTrainings.filter(i => i.attendances === undefined).length > 0;

  if (groupMembers === undefined) {
    body = <p>Select a group</p>
  } else {
    body = <p>TODO</p>;

    const columns: GridColDef[] = [
      { field: 'ref', headerName: "DEM", width: 80 },
      { field: 'name', headerName: "Name", width: 170 },
      { field: 'email', headerName: "Email", width: 170 }
    ];

    selectedTags.forEach(t => {
      columns.push({
        field: 'trainingTag_' + t,
        headerName: t,
        width: 100
      });
    })

    const rows = groupMembers.map(m => {
      let row:any = {
        id: m.id,
        ref: m.ref,
        name: m.name,
        email: m.email
      };

      selectedTags.forEach(tag => {
        if (hasUnloadedAttendances) {
          row['trainingTag_' + tag] = "Click Run Report";
          return;
        }

        let minutes = 0;
        filteredTrainings.filter(t => t.tags.includes(tag)).forEach(t => {
          let a = t.attendances?.find(a => a.member.id === m.id);
          if (a) {
            minutes += a.duration;
          }
        });
        row['trainingTag_' + tag] = minutes / 60.0;
      });

      return row;
    })
    
    body = <DataGrid
      rows={rows}
      columns={columns}/>
  }

  return (<div>
    <div>
      <Autocomplete
        options={availableGroups}
        getOptionLabel={(option:IGroupListItem) => option.title}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Group"
            placeholder="Group"
          />
        )}
        value={selectedGroup}
        onChange={(event: any, newValue: IGroupListItem | null) => {
          setSelectedGroup(newValue ?? undefined);
        }}/>
      <DatePicker
        label="Start date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue ?? lastMarchFirst)}/>
      <DatePicker
        label="End date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue ?? currentDate.startOf('day'))}/>
      <Autocomplete
        multiple
        options={availableTags}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Categories of trainings"
            placeholder="Training tags"
          />
        )}
        value={selectedTags}
        onChange={(event: any, newValue: string[]) => {
          setSelectedTags(newValue);
        }}/>
        <div>
          {selectedTags.map(tag => (
            <TextField
              label={"Minimum " + tag + " hours"}
              type="number"
              value={minimumHoursPerTag.get(tag) ?? 0}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                let copy = new Map<string, number>(minimumHoursPerTag);
                copy.set(tag, parseInt(event.target.value) ?? 0);
                setMinimumHoursPerTag(copy);
              }}/>
          ))}
        </div>
        {hasUnloadedAttendances && <Button
          variant="contained"
          color="primary"
          onClick={runReport}>
            Run report
        </Button>}
    </div>
    <div>Filtered trainings: {filteredTrainings.length}</div>
    <div>
      {body}
    </div>
  </div>)
}

export default TrainingsReport;