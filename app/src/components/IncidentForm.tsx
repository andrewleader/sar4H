import * as React from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';


const IncidentForm = () => {
  const [value, setValue] = React.useState('Incident');
  const [startDate, setDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());


  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleStartDateChange = (event: any)=>{
    setDate(event.format())
  }
  const handleEndDateChange = (event: any)=>{
    setEndDate(event.format())
  }
  
  const handleSubmit = () => {
    alert("test")
  }

return(
  <div>
{/*className={classes.root}*/}
  <form   noValidate autoComplete="off"> 

    <TextField id="standard-basic" label="Incident Name" />

    <FormLabel component="legend">Event Type</FormLabel>
      <RadioGroup aria-label="EventType" name="type" value={value} onChange={handleChange}>
        <FormControlLabel value="Incident" control={<Radio />} label="Incident/Mission" />
        <FormControlLabel value="Exercise" control={<Radio />} label="Exercise/Training" />
        <FormControlLabel value="Event" control={<Radio />} label="Event/Meeting" />
      </RadioGroup>

      <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker  
          disableToolbar
          variant="inline"
          label="Start Date"
          value= {startDate}
          onChange={handleStartDateChange}
        />
      
      <DatePicker  
          disableToolbar
          variant="inline"
          label="End Date"
          value= {endDate}
          onChange={handleEndDateChange}
        />
    </MuiPickersUtilsProvider>
    
    <Button 
      onClick={()=> handleSubmit()}
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

