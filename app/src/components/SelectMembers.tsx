import React from 'react';
import {
  FormLabel,
  FormControl,
  FormGroup,
 } from '@material-ui/core';
import ListUnitMembers from './ListUnitMembers'

export const SelectMembers = (props: any) => {

  return(
    <div>
    <FormControl component="fieldset">
      <FormLabel component="legend">
        Who Is Attending?
      </FormLabel>
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



