import React, {useState} from 'react';
import {
  FormLabel,
  Button, 
  FormControl, 
  FormGroup, 
 } from '@material-ui/core';
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


export const SelectMembers = () => {

  const [attendees, setAttendees] = useState(Members)

  function handleSubmit(event: any){
    event.preventDefault()

    let isAttending = attendees
      .filter(attendee => attendee.isAttending === true)
    
    alert(`Submitted Form. List who is going:
      ${isAttending.map(attending => attending.name)}
    `)
  }


  const handleAttendingChange = (
      memberIdx: number, 
      attendanceState: boolean
    ) => {

    // from the state attendees array, get the correct object 
    // for updatedAttendee
    const updatedAttendee = attendees[memberIdx]  

    // update boolean property of the attendee
    updatedAttendee.isAttending = attendanceState 

    // bb: make a copy of previous state of attendees
    const newAttendees = [...attendees]           

    // insert/overwrite array object of the attendee in question 
    // with the new version
    newAttendees[memberIdx] = updatedAttendee     

    // update state  
    setAttendees(newAttendees)                    

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
      {/* <Button 
        type="submit"
        variant="contained"
        size="large" 
        color="primary"
      >
          Submit 
      </Button> */}
    </div>
  </form>  
</div>
  )
}



