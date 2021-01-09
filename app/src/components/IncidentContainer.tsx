import React from 'react'
import IncidentForm from './IncidentForm'
import MembershipModel from '../models/membershipModel';

const NewIncidentContainer = (props: {
    membership: MembershipModel
  }
) => {

  return (
  <>
    <IncidentForm membership={props.membership}/>
  </>
  )

}

export default NewIncidentContainer
