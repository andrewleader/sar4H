import React, {useState, useEffect} from 'react';
import Api from '../api';
import {makeStyles} from '@material-ui/core';
import CookiesHelper from "../helpers/cookiesHelper";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';



const ListUnitMembers = (props: any) => {
  
  const [state, setState] = useState({
    attending: false,
  }
  );
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    setState(
      {
        ...state,
        [event.target.name]: event.target.checked 
      }
    );
  };
  
  return(
    <>
      <FormControlLabel
        control={
          <Switch
            checked={state.attending}
            onChange={handleChange}
            name={"attending"}
          />} 
        label={props.name }
      />
     
    </>
  )
}


export default ListUnitMembers


