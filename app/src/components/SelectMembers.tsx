import React, {useState, FC} from 'react';
import {
  FormLabel,
  // Button,
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

export const SelectMembers = (props: any) => {
  const [attendees, setAttendees] = useState(props.members)

  const handleAttendingChange = (
      memberIndex: number,
      attendanceState: boolean,
    ) => {

    // from the state attendees array, get the correct member
    // for updatedAttendee
    const updatedAttendee = attendees[memberIndex]

    // indicate if member is going;
    updatedAttendee.isAttending = attendanceState

    // copy state of attendees to have a new state to update
    const newAttendees = [...attendees]

    // insert/overwrite array object of the attendee in question
    // with the new version
    newAttendees[memberIndex] = updatedAttendee

    // update state
    setAttendees(newAttendees)

  }

  return(
    <div>
    <FormControl component="fieldset">
      <FormLabel component="legend">
        Who Is Attending?
      </FormLabel>
        <FormGroup>
          {attendees.map((member: any, i: number) => {
                return (
                  <ListUnitMembers
                    key={i}
                    member={member}
                    memberIdx={i}
                    handleAttendingChange={handleAttendingChange}
                  />
                )
              }
            )
          }
        </FormGroup>
      </FormControl>
    </div>
  )
}



