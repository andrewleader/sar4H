import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles, TextField, FormLabel, FormControlLabel, RadioGroup, Radio, Button, FormHelperText, FormControl, FormGroup, Switch } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import CookiesHelper from "../helpers/cookiesHelper";
import {useHistory} from "react-router-dom";
import ListUnitMembers from './ListUnitMembers'


 const Members = [  // config constant
  {
    name: "Santa",
    id: 9687,
    isAttending: false
  },
  {
    name: "Grinch",
    id: 45, 
    isAttending: false

  }, 
  {
    name: "Tooth Fairy",
    id: 987,
    isAttending: false

  }
]

export const Test = () => {

  const [attendees, setAttendees] = useState(Members)

  function handleSubmit(event: any){
    event.preventDefault()

    let isGoing = attendees.filter(attendee => attendee.isAttending === true)
    
    alert(`Submitted Form. List who is going: ${isGoing.map(going => going.name)}`)
  }
 
  const handleAttendingChange = (memberIdx: number, attendanceState: boolean) => {
  // setState({ ...state, [event.target.name]: event.target.checked });

    const updatedAttendee = attendees[memberIdx]  // set the id of the attendee to access it's properties
    updatedAttendee.isAttending = attendanceState // update boolean of the attendee

    const newAttendees = [...attendees]           // make a copy of previous state of attendees
    newAttendees[memberIdx] = updatedAttendee     // insert/overwrite array object of the attendee in question with the new version
    setAttendees(newAttendees)                    // update state  

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
        {attendees.map((member, i) => {
            return (    
              <ListUnitMembers 
              key={i}
              member={member}
              memberIdx={i}
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



