import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles} from '@material-ui/core';
import CookiesHelper from "../helpers/cookiesHelper";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';



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
            onChange={() =>{ handleAttendingChange(memberIdx, !member.isAttending)}}
            value={"attending"}   // D4H uses this string in their API to set attendance correctly 
          />} 
        label={member.name }
      />
    </>
  )
}

export default ListUnitMembers


// if you had an input with an onChange handler, then you'd want the event.target.value.
// event.target.value is only useful for form elements with changing values.