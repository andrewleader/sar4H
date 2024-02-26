import React from 'react';
import ListUnitMembers from './ListUnitMembers'
import { FormControl, FormGroup } from '@mui/material';

export const SelectMembers = (props: any) => {

  return(
    <div>
    <FormControl component="fieldset">
        <FormGroup>
          {props.members.map((member: any, i: number) => {
                return (
                  <ListUnitMembers
                    key={i}
                    member={member}
                    memberIdx={i}
                    handleAttendingChange={props.handleAttendingChange}
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



