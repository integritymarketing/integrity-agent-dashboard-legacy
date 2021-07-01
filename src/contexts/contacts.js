import React, { createContext, useState } from "react";

const ContactsContext = createContext({
  duplicateIds: [],
});

export const ContactsProvider = (props) => {
  const [duplicateIds, setDuplicateIds] = useState([]);

  return (
    <ContactsContext.Provider
      value={{ duplicateIds, setDuplicateIds }}
      {...props}
    />
  );
};

export default ContactsContext;
