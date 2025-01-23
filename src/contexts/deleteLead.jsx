import React, { createContext, useState } from "react";

const DeleteLeadContext = createContext();

export const DeleteLeadProvider = (props) => {
  const [deleteLeadId, setDeleteLeadId] = useState(null);
  const [leadName, setLeadName] = useState(null);

  return (
    <DeleteLeadContext.Provider
      value={{
        setLeadName: (name) => setLeadName(name),
        setDeleteLeadId: (id) => setDeleteLeadId(id),
        leadName,
        deleteLeadId,
      }}
      {...props}
    />
  );
};

export default DeleteLeadContext;
