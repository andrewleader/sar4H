import React, {useState, useEffect} from 'react';
import Api from '../api';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import CookiesHelper from "../helpers/cookiesHelper";
import {SelectMembers} from './SelectMembers'
import MembershipModel from '../models/membershipModel'
import { Button, Collapse, FormControlLabel, FormHelperText, FormLabel, List, ListItem, ListItemText, Radio, RadioGroup, TextField, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';


const StyledForm = styled('form')({
  padding: "20px 20px",
  display: "block",
});

const StyledNested = styled(ListItem)({
  paddingLeft: "34px",
});

const fieldBottomMargin = "20px";

const initialValues = {
  activity: "", // "incident", "exercise", or "event"
  title: "", // activity name
}

const initialErrors = {
  titleErrorMsg: "",
  titleValidity: false,   // if title empty, flip to true
  formValidity: false,    // if all form data good, flip to true
  eventValidity: false,   // if event type empty, flip to true
  eventErrorMsg: "",
  dateValidity: false,
  dateErrorMsg: "",
}

const initialDates = {
  // object names formatted to match API requirements
  startDate: new Date(),
  enddate: new Date(new Date().getTime() + 10000) // D4H requires different times
}

const InitialMembers = [  // config constant
    {
      name: "loading....",
      id: 9687,
      isAttending: false
    },
  ]

function IncidentForm(props: {
    membership: MembershipModel
  }
){
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState(initialErrors)
  const [dates, setDates] = useState(initialDates)
  const [members, setMembers] = useState(InitialMembers)
  const [open, setOpen] = useState(false) // MaterialUI open/close list 

  useEffect(() => {validateDates()}, [dates]) // validate dates if dates is updated

  useEffect(() => {
    async function loadAsync() {
      let result = await props.membership.getMembersAsync({
        group_id: 7965,
        include_details: false
      })
      let teamMembers:any = []

      result.forEach(
        member => teamMembers.push({
          name: member.name,
          id: member.id
        })
      )
      setMembers(teamMembers)
    }

    loadAsync();

  }, [props.membership]);

  let navigate = useNavigate();


  const handleAttendingChange = (
      memberIndex: number,
      attendanceState: boolean,
    ) => {

    // from the state attendees array, get the correct member
    // for updatedAttendee
    const updatedAttendee = members[memberIndex]

    // indicate if member is going;
    updatedAttendee.isAttending = attendanceState

    // copy state of attendees to have a new state to update
    const newAttendees = [...members]

    // insert/overwrite array object of the attendee in question
    // with the new version
    newAttendees[memberIndex] = updatedAttendee

    // update state
    setMembers(newAttendees)

  }


  const handleInputChange = (event: any) => {
    const {
      name,
      value
    } = event.target

    let titleErrorMsg: string
    let titleValidity: boolean
    let eventValidity: boolean
    let eventErrorMsg: string

    switch(name){
      case 'title':
        const valueLengthCompare = value.length < 4 && value.length >= 0

        titleErrorMsg = valueLengthCompare ? 'Title must be longer than 4 characters' : ""
        titleValidity = valueLengthCompare ? true : false
        
        setErrors({
          ...errors,
          titleErrorMsg,
          titleValidity,
        })
      break

      case 'activity':
        eventValidity = value.length > 0 ? true : false
        eventErrorMsg = ""

        setErrors({
          ...errors,
          eventValidity,
          eventErrorMsg,
        })
      break

      default:
        break
    }


    setValues({
      ...values,
      [name]:value
    })
  }


  const handleDateChange =  (
    dateName: string,
    event: any
    ) => {
      setDates(prevState => ({
          ...prevState,
          [dateName]: event.format()
        }))
  }


  function validateDates() {

    let dateErrorMsg: string = ""
    let dateValidity: boolean = false

    //turn comparision into bool for the nested ternary below
    const dateRangeCheck = (new Date(dates.startDate) <= new Date(dates.enddate))

    dateErrorMsg = dateRangeCheck ? "" : "End date can't be before start date."

    // true if error - end date before start date
    dateValidity = dateRangeCheck ? false : true

    setErrors( prevState => ({
      ...prevState,
      dateValidity,
      dateErrorMsg,
    }))
  }


  function formatDateToISO(date: Date){
    // when a form date isn't changed by user, it is wrong format
    // this function turns all date{} into ISO strings per API
    if(typeof(date) !== "string"){
      return date.toISOString()
    }
    else {
      return date
    }
  }


  function addSeconds(date: string, secondsToAdd: number){
    // D4H needs start time and end time differnt.
    // currently,code doesn't allow selecting of time.
    // this is a temp workaround to make different times by 10 seconds
    let updatedDateTime: Date = new Date(new Date(date).getTime() + secondsToAdd)

    return updatedDateTime.toISOString()
  }


  async function handleSubmit(event: any){
    event.preventDefault()

    let token = CookiesHelper.getCookie("membership" + "1516")!;
    let url: string
    let missionActivityId: number = 0 // id for API post

    // if format is date{}, POST doesn't work. turn format into ISO8601
    let startDate:string = formatDateToISO(dates.startDate)
    let end:string = formatDateToISO(dates.enddate)
    let enddate:string = addSeconds(end, 10)

    //does not validate attendance, which is optional
    const {
      formValidity,
      titleValidity,
      titleErrorMsg,
      eventValidity,
      eventErrorMsg,
      dateErrorMsg,
      dateValidity,} = await validateForm(values, event)
    
    setErrors( prevState => ({
      ...prevState,
      formValidity,
      titleValidity,
      titleErrorMsg,
      eventValidity,
      eventErrorMsg,
      dateErrorMsg,
      dateValidity
    }))

    // if no errors (aka true), send mission to database
    if(formValidity){
      await Api.addIncidentAsync(
        token,
        values.title,
        values.activity,
        startDate,
        enddate,
        ).then(response =>{
          missionActivityId = response.data.id
        })

      // set mission attendance, which is optional
      members.forEach(member => {
        if(member.isAttending){
          Api.addAttendanceAsync(
            token,
            missionActivityId,
            member.id,
            new Date(startDate),
            new Date(enddate),
          ).then(response => {
              console.log(response)
            })
        }
      })

      url = '/1516/missions/' + missionActivityId;
      navigate(url);

    }
    
  } // end handle submit


  async function validateForm(formValues: any, event: any)  {
    let formValidity = true  // assume form is good/true unless error below

    let titleValidity: boolean = false
    let titleErrorMsg: string = ""
    let eventValidity: boolean = false
    let eventErrorMsg: string = ""
    let startDate: string = event.target.date.value
    let endDate: string = event.target.enddate.value
    let dateErrorMsg = ""
    let dateValidity: boolean = false

    if (formValues.title.length < 4 ){
      formValidity = false
      titleValidity = true
      titleErrorMsg = "Please fill out."
    }

    if (formValues.activity === ""){
      formValidity = false
      eventValidity = true
      eventErrorMsg = "Please select an event."
    }

    if (
          (new Date(startDate) > new Date(endDate))
          ||
          (new Date(endDate) < new Date(startDate))
    ) {
      
      // set date error validation true
      dateErrorMsg = "End date can't be before start date."
      dateValidity = true
    }

    return {
      formValidity,
      titleValidity,
      titleErrorMsg,
      eventValidity,
      eventErrorMsg,
      dateErrorMsg,
      dateValidity,
    }
  }


  const handleListClick = () => {
    setOpen(!open);
  };


return(
  <StyledForm>

  <form
    noValidate
    autoComplete="off"
    onSubmit={handleSubmit}
  >
    <TextField
      label="Event Name"
      id="standard-basic"
      name="title"
      value={values.title}
      onChange={handleInputChange}
      required
      error={errors.titleValidity}
      helperText={errors.titleErrorMsg}
      autoFocus
      style={{
        marginBottom: fieldBottomMargin
      }}
      fullWidth
    />

    <FormLabel
      component="legend"
      required
    >
      Event Type
    </FormLabel>
      <RadioGroup
        aria-label="EventType"
        name="activity"
        onChange={handleInputChange}
        style={{
          marginBottom: fieldBottomMargin
        }}
      >
        <FormHelperText
        error={errors.eventValidity}
        >
        {errors.eventErrorMsg}
        </FormHelperText>
          <FormControlLabel
            value="incident"
            control={<Radio />}
            label="Incident/Mission"
          />
          <FormControlLabel
            value="exercise"
            control={<Radio />}
            label="Exercise/Training"
          />
          <FormControlLabel
            value="event"
            control={<Radio />}
            label="Event/Meeting"
          />
      </RadioGroup>

      {/* <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          // minDate={new Date()}
          minDate={moment()}
          variant="inline"
          label="Start Date"
          name="date"
          format="yyyy-MM-DD"
          value={dates.startDate}
          onChange={(value) => handleDateChange("startDate", value)}
          className={classes.field}
          fullWidth
        />
        <KeyboardDatePicker
          disableToolbar
          minDate={new Date()}
          variant="inline"
          label="End Date"
          name="enddate"
          format="yyyy-MM-DD"
          value={dates.enddate}
          onChange={(value) => handleDateChange("enddate", value)}
          helperText={errors.dateErrorMsg}
          error={errors.dateValidity}
          className={classes.field}
          fullWidth
        />
      </MuiPickersUtilsProvider> */}

      <FormLabel component="legend">
        Who Is Attending?
      </FormLabel>
      <List> 
        <ListItem button onClick={handleListClick}>
        <ListItemText primary="EMRU Members List" />
          {open ?  <ExpandLess /> : <ExpandMore /> }
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <StyledNested>
          {members ?
            <SelectMembers
              members={members}
              handleAttendingChange={handleAttendingChange}
            />
            : "...loading"
          }
          </StyledNested>
        </List>
      </Collapse>
    </List>
      
      <div >
        <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
        >
            Create event
        </Button>
      </div>
    </form>
  </StyledForm>
  )
}
export default IncidentForm

