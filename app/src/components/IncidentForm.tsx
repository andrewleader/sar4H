import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button, FormHelperText} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import CookiesHelper from "../helpers/cookiesHelper";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  form: {
    padding: "14px",
    display: "block",
  },
  card: {
    marginBottom: "24px"
  },
  root: {
    border: 0,
    borderRadius: 3,
    height: 48,
    padding: '030px',
  },
}));


const initialValues = {
  activity: ""  , // "incident", "exercise", or "event"
  title: "", // activity name
 
}
const initialErrors = {
  titleErrorMsg: "",  
  titleValidity: false,   // if title empty, flip to true 
  formValidity: false,    // if all form data good, flip to true
  eventValidity: false,   // if event type empty, flip to true
  eventErrorMsg: "",
  dateValidity: false,   
  dateErrorMsg: ""
}

const initialDates = {
  startDate: new Date(),  // object names formatted to match API requirements
  enddate: new Date()
}


function IncidentForm(){
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState(initialErrors)
  const [dates, setDates] = useState(initialDates)
  

  let history = useHistory();
  const classes = useStyles();


  const handleInputChange = (event: any)=>{ 
    const {name, value} = event.target

    let titleErrorMsg: string
    let titleValidity: boolean
    let eventValidity: boolean
    let eventErrorMsg: string

    switch(name){
      case 'title':
        const valueLengthCompare = value.length < 4 && value.length > 0
        
        titleErrorMsg = valueLengthCompare ? 'Title must be longer then 4 characters' : ""
        titleValidity = valueLengthCompare ? true : false 
      break
      
      case 'activity':
        eventValidity = value.length > 0 ? false : true
        eventErrorMsg = ""
      break

      default:
        break
    }

    setErrors(prevState => ({
      ...prevState,
      titleErrorMsg,
      titleValidity,
      eventValidity,
      eventErrorMsg
    }))

    setValues({ 
      ...values,
      [name]:value 
    })
  }

const handleDateChange =  ( dateName: string, event: any) => {
  setDates({ 
    ...dates,
    [dateName]: event.format()
  })

  validateDates()
}

 function validateDates() {
    let dateErrorMsg: string = ""
    let dateValidity: boolean = false

    const dateRangeCheck = (new Date(dates.startDate) <= new Date(dates.enddate))  

    dateErrorMsg = dateRangeCheck ? "" : "End date can't be before start date."

    dateValidity = dateRangeCheck ? false : true  // true if error - end date before start date
      
    setErrors( prevState => ({
      ...prevState,
      dateValidity,
      dateErrorMsg,
    }))
  }


  function handleSubmit(event: any){
    event.preventDefault()
  
    let token = CookiesHelper.getCookie("membership" + "1516")!;
    let url: string 

    const {
      formValidity,
      titleValidity,
      titleErrorMsg,
      eventValidity,
      eventErrorMsg,
      dateErrorMsg,
      dateValidity,} = validateForm(values, event)
    

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
    

    if(formValidity){ // if no errors (aka true), send to database

    // Api.addIncidentAsync(
    //   token,
    //   values.title,
    //   values.activity,
    //   dates.startDate,
    //   dates.enddate
    //   ).then(response =>{
        
    //     url = '/1516/missions/' + response.data.id
    
    //     history.push(url)
    //   })

    alert( dates.startDate,  )
    }
  }

  function validateForm(formValues: any, event: any)  {
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
      eventErrorMsg = "Please select a type"
    }

    if ((new Date(startDate) > new Date(endDate)) || (new Date(endDate) < new Date(startDate))) {
      // set date error validation true 
      dateErrorMsg = "End date can't be before start date."
      dateValidity = true
      
    } else {
      // null or false date error validation 
    }

    return {
      formValidity,
      titleValidity,
      titleErrorMsg, 
      eventValidity, 
      eventErrorMsg,
      dateErrorMsg,
      dateValidity
    }
  }


return(
  <div className={classes.root}>

  <form   noValidate autoComplete="off" onSubmit={handleSubmit}> 
    <TextField 
      id="standard-basic" 
      label="Event DEM # and Name"
      name="title"
      value={values.title}
      onChange={handleInputChange}
      required
      error={errors.titleValidity}
      helperText={errors.titleErrorMsg}
      autoFocus
      className={classes.form}
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

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker  
          disableToolbar
          minDate={new Date()}
          variant="inline"
          label="Start Date" 
          name="date"
          format="yyyy-MM-DD"
          value={dates.startDate}
          onChange={(value) => handleDateChange("startDate", value)}
          className={classes.form}
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
          className={classes.form}
        />
      </MuiPickersUtilsProvider>
    
      <Button 
        type="submit"
        variant="contained"
        size="large" 
        color="primary" >
          Submit 
      </Button>
    </form>  
  </div>

  )
}
export default IncidentForm

