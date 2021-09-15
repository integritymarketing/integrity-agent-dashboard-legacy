import React, { createContext, useState } from "react";

const ContactsContext = createContext({
  duplicateIds: [],
  newSoaContactDetails: {},
});

export const ContactsProvider = (props) => {
  const [duplicateIds, setDuplicateIds] = useState([]);
  const [newSoaContactDetails, setNewSoaContactDetails] = useState({});

  return (
    <ContactsContext.Provider
      value={{
        duplicateIds,
        setDuplicateIds,
        newSoaContactDetails,
        setNewSoaContactDetails,
      }}
      {...props}
    />
  );
};

export default ContactsContext;
