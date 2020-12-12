import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button} from '@material-ui/core';
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


let initialValues = {
  activity: ""  , // "incident", "exercise", or "event"
  title: "", // activity name
  errors: { 
    "title": ""
  },
  titleValidity: false,
  formValidity: false
}

function IncidentForm(){
  const [values, setValues] = useState(initialValues)
  const [startDate, setDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());

  let history = useHistory();
  const classes = useStyles();


  const handleInputChange = (event: any)=>{ 
    const {name, value} = event.target

    switch(name){
      case 'title':
        values.errors.title = value.length < 4  ? 'Title must be longer then 4 characters' : ""
        let x = value.length > 3 ? false : true 
        values.titleValidity = x

        break
      default:
        break
    }

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



  function handleSubmit(event: any){
    event.preventDefault()
  
    let token = CookiesHelper.getCookie("membership" + "1516")!;
    let url: string 

    const {formValues, formValidity} = validateForm(values)
    const titleValidity = formValues.titleValidity

    setValues({
      ...values,
      titleValidity
      })
    

    if(formValidity){
      // if no errors, send to database



    // Api.addIncidentAsync(
    //   token,
    //   event.target.title.value, 
    //   event.target.activity.value, 
    //   event.target.date.value, 
    //   event.target.enddate.value).then(response =>{
        
    //     url = '/1516/missions/' + response.data.id
    
    //     history.push(url)
    //   })

    alert("submitted")
    
    }

    
    }

    function validateForm(formValues: any)  {
      let formValidity = true

      // if (!formValues.errors.title 
      if (formValues.title.length < 4 ){
        formValidity = false
        formValues.titleValidity = true
        formValues.errors.title = "Please complete with 4 or more characters."
      }
      
      // setValues(formValues)
      
      // return formValidity
      return {formValues, formValidity}
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
      required
      error={values.titleValidity}
      helperText={values.errors.title}
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
          value={startDate}
          // inputValue={inputStartValue}
          onChange={handleStartDateChange} 
          // onChange={(event: any) => {debugger
          //    setDate(event._i)}} 
          className={classes.form}
        />
      
      <KeyboardDatePicker  
          disableToolbar
          minDate={new Date()}
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

