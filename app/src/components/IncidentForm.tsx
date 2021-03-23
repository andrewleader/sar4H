import React, {useState, useEffect} from 'react';
import Api from '../api';
import {
  makeStyles,
  TextField,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  FormHelperText,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
  } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import CookiesHelper from "../helpers/cookiesHelper";
import {useHistory} from "react-router-dom";
import {SelectMembers} from './SelectMembers'
import MembershipModel from '../models/membershipModel'


const useStyles = makeStyles({
  form: {
    padding: "5px 25px",
    display: "block",
    maxWidth: 250,
    minWidth: 230,
  },
  label: {
    padding: "12% 0 3% 0 ",
  },
  nestedItems: {
    paddingLeft: "7%",
  },
  inputFields: {
    paddingLeft: "6%"
  },
});

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

      result.data.forEach(
        member => teamMembers.push({
          name: member.name,
          id: member.id
        })
      )
      setMembers(teamMembers)
    }

    loadAsync();

  }, [props.membership]);

  let history = useHistory();
  const classes = useStyles();


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

        titleErrorMsg = valueLengthCompare ? 'Title must be longer then 4 characters' : ""
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

      url = '/1516/missions/' + missionActivityId
      history.push(url)

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
  <div className={classes.form}>

  <form
    noValidate
    autoComplete="off"
    onSubmit={handleSubmit}
  >
    <FormLabel
      component="legend"
      required
      className={classes.label}
    >
      Event Name
    </FormLabel>
    <TextField
      // label="Event Name"
      id="standard-basic"
      name="title"
      value={values.title}
      onChange={handleInputChange}
      required
      error={errors.titleValidity}
      helperText={errors.titleErrorMsg}
      autoFocus
      className={classes.inputFields}
    />

    <FormLabel
      component="legend"
      required
      className={classes.label}
    >
      Event Type
    </FormLabel>
      <RadioGroup
        aria-label="EventType"
        name="activity"
        onChange={handleInputChange}
        className={classes.inputFields}
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

      <MuiPickersUtilsProvider
        utils={MomentUtils}
      >
      <FormLabel
      component="legend"
      required
      className={classes.label}
      >
        Start Date
      </FormLabel>
        <KeyboardDatePicker
          disableToolbar
          // minDate={new Date()}
          minDate={moment()}
          variant="inline"
          // label="Start Date"
          name="date"
          format="yyyy-MM-DD"
          value={dates.startDate}
          onChange={(value) => handleDateChange("startDate", value)}
          className={classes.inputFields}
          />

      <FormLabel
        component="legend"
        required
        className={classes.label}
      >
        End Date
      </FormLabel>
        <KeyboardDatePicker
          disableToolbar
          minDate={new Date()}
          variant="inline"
          // label="End Date"
          name="enddate"
          format="yyyy-MM-DD"
          value={dates.enddate}
          onChange={(value) => handleDateChange("enddate", value)}
          helperText={errors.dateErrorMsg}
          error={errors.dateValidity}
          className={classes.inputFields}
          />
      </MuiPickersUtilsProvider>

      <FormLabel
        component="legend"
        className={classes.label}
      >
        Who Is Attending?
      </FormLabel>
      <List> 
        <ListItem
          button
          onClick={handleListClick}
          className={classes.inputFields}
        >
          <ListItemText 
            primary="EMRU Members List"
          />
              {open ?
                <ExpandLess /> : <ExpandMore />
              }
        </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding >
          <ListItem button className={classes.nestedItems}>
            {members ?
              <SelectMembers
                members={members}
                handleAttendingChange={handleAttendingChange}
              />
              : "...loading"
            }
          </ListItem>
        </List>
      </Collapse>
    </List>
      
      {/* <div > */}
        <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
        >
            Submit
        </Button>
      {/* </div> */}
    </form>
  </div>
  )
}
export default IncidentForm

