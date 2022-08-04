import React from "react";
import { useParams } from "react-router-dom";
import useContactDetails from "./useContactDetails";
import Activities from './Activities';
import Container from "packages/Container";

const ContactDetails = () => {
  const { contactId } = useParams();
  const { isLoading, getLeadDetails } = useContactDetails(contactId);

  return isLoading 
    ? ( <div>Loading</div>)
    : (<Container>
        <Activities getLeadDetails={getLeadDetails} />
    </Container>)
};

export default ContactDetails;
