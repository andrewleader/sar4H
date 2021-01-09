import React from 'react';
import {
  FormControlLabel, 
  Switch
  } from '@material-ui/core'


const ListUnitMembers = (props: any) => {
  const {
    member, 
    memberIdx,
    handleAttendingChange
  } = props
  
  return(
    <>
      <FormControlLabel
        control={
          <Switch
            checked={member.isAttending}
            onChange={() => {
                handleAttendingChange(
                  memberIdx, 
                  !member.isAttending
                )
              }
            }
            value={"attending"} // API requirement to set attendance correctly 
          />
        } 
        label={member.name}
      />
    </>
  )
}

export default ListUnitMembers
