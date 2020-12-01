import * as React from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio,} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';


const handleChange = () =>{
console.log("do something")
}



const NewIncident = () => {
  const [value, setValue] = React.useState('Incident');
  const [selectedDate] = React.useState(new Date());


  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleDateChange = ()=>{
    console.log("do something")
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
          value= {selectedDate}
          onChange={handleDateChange}
        />
    </MuiPickersUtilsProvider>

  </form>  

</div>
  

)

}
export default NewIncident

