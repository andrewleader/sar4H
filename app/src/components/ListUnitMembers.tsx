import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles} from '@material-ui/core';
import CookiesHelper from "../helpers/cookiesHelper";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

/////////////////////////////
////////////////////////////////////////
//////////////////////////////////

const ListUnitMembers = (props: any) => {
  
  // const [state, setState] = useState({
  //   attending: false,
  // }
  // );
 
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  //   setState(
  //     {
  //       ...state,
  //       [event.target.name]: event.target.checked 
  //     }
  //   );
  // };



  const {member, memberIdx, handleAttendingChange} = props; 
  return(
    <>
      <FormControlLabel
        control={
          <Switch
            checked={member.isAttending}
            onChange={event => { handleAttendingChange(memberIdx, !member.isAttending) }}
            value={"attending"}
          />} 
        label={member.name }
      />
     
    </>
  )
}


export default ListUnitMembers


  // <FormLabel component="legend">Are you {isMission ? 'responding' : 'attending'}?</FormLabel>
  //     <FormControlLabel
  //         control={
  //           <Switch 
  //           checked={props.isAttending}
  //           onChange={handleRespondingChange} 
  //           value="responding"
  //           disabled={props.isLoadingIsAttending} />
  //         }
  //         label={
  //           props.isAttending ? (
  //             isMission ? 'Responding' : 'Attending')
  //               :
  //                (isMission ? 'Not responding' : 'Not attending')}
  //         className={classes.respondingSwitch}
  //       />