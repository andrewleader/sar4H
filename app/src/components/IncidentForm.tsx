import React, {useState} from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import CookiesHelper from "../helpers/cookiesHelper";


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
    padding: '0 30px',
  },
}));


let initialValues = {
  activity: ""  , // "incident", "exercise", or "event"
  title: "", // activity name
}


const IncidentForm = () => {
  const [values, setValues] = useState(initialValues);
  const [startDate, setDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());

  const classes = useStyles();

  const handleInputChange = (event: any)=>{ 
   const {name, value} = event.target
    setValues({ 
      ...values,
      [name]:value 
    })
  }
  const handleStartDateChange = (event: any)=>{
    setDate(event.format())
  }
  const handleEndDateChange = (event: any)=>{
    setEndDate(event.format())
  }
  
  const handleSubmit = (event: any) => {
    event.preventDefault()
    let token = CookiesHelper.getCookie("membership" + "1516")!;
    
    let result =  Api.addIncidentAsync(
      token,
      event.target.title.value, 
      event.target.activity.value, 
      event.target.date.value, 
      event.target.enddate.value)
      

      console.log(result)
  }

return(
  <div className={classes.root}>

  <form   noValidate autoComplete="off" onSubmit={handleSubmit}> 

    <TextField 
      id="standard-basic" 
      label="Incident Name"
      name="title"
      value={values.title}
      onChange={handleInputChange}
      className={classes.form}
  
    />

    <FormLabel component="legend">Event Type</FormLabel>
      <RadioGroup 
        aria-label="EventType" 
        name="activity"
        onChange={handleInputChange}
        
      >
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
          variant="inline"
          label="Start Date" 
          name="date"
          format="yyyy-MM-DD"
          value={startDate}
          onChange={handleStartDateChange} 
          className={classes.form}
        />
      
      <KeyboardDatePicker  
          disableToolbar
          variant="inline"
          label="End Date"
          name="enddate"
          format="yyyy-MM-DD"
          value= {enddate}
          onChange={handleEndDateChange}
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

