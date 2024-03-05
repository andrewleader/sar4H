import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';


const ListUnitMembers = (props: any) => {
  const {
    member,
    memberIdx,
    handleAttendingChange,
    isAttending
  } = props

  return(
    <>
      <FormControlLabel
        control={
          <Switch
            checked={isAttending}
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
