import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button, FormHelperText, FormControl, FormGroup, Switch } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import CookiesHelper from "../helpers/cookiesHelper";
import {useHistory} from "react-router-dom";
import ListUnitMembers from './ListUnitMembers'


 const members = [
  {
    name: "Alec",
    id: 9687,
    isAttending: false
  },
  {
    name: "Pam",
    id: 45, 
    isAttending: false

  }, 
  {
    name: "Dan",
    id: 987,
    isAttending: false

  }
]

export const Test = () => {

  const [state, setState] = useState(members)

  function handleSubmit(event: any){
    event.preventDefault()
    
    alert(`Submitted Form }`)
  }
 
  const handleAttendingChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  setState({ ...state, [event.target.name]: event.target.checked });
debugger
  }

 

 
  return(
    <div>
    <form 
      noValidate 
      autoComplete="off"
      onSubmit={handleSubmit}> 

    <FormControl component="fieldset">
    <FormLabel component="legend">
      Who Is Attending?
    </FormLabel>

      <FormGroup>
        {members.map((member, i) => {
            return (    
              <ListUnitMembers 
              key={i}
              member={member.name}
              name={i}
              isAttending={member.isAttending}
              handleAttendingChange={handleAttendingChange}
              />
            )
          })}
      </FormGroup>
            
    
    
    </FormControl>
  <div>
  <Button 
    type="submit"
    variant="contained"
    size="large" 
    color="primary"
    >
      Submit 
  </Button>
</div>
</form>  
</div>
  )
}





{/* <FormControlLabel
control={
  <Switch
    checked={member.attending}
    onChange={handleChange}
    name={member.name}
  />} 
label={member.name }
/> */}