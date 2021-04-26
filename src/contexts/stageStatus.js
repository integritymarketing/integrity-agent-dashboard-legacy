import React, { createContext, useState, useEffect, useMemo } from "react";
import clientsService from "services/clientsService";

const colorCodes = {
  New: "#2082F5",
  Quoted: "#EDB72C",
  Lost: "#565656",
  Enrolled: "#565656",
  Open: "Orange",
  Applied: "#65C15D"
};

const StageStatusContext = createContext({
  message: "",
  isVisible: false,
});

export const StageStatusProvider = (props) => {
    const [allStatuses, setAllStatuses] = useState([]);
    const statusOptions = useMemo(() => {
        return allStatuses.map(status => ( {
          value: status.statusName,
          label: status.statusName,
          color: status.colorCode || colorCodes[status.statusName] || "#EDB72C",
        }));
      }, [allStatuses]); 

    useEffect(() => {
        const doFetch = async () => {
          const statuses = await clientsService.getStatuses();
          setAllStatuses(statuses);
        };
    
        doFetch();
      }, []);

  return <StageStatusContext.Provider value={{allStatuses, statusOptions, colorCodes}} {...props} />;
};

export default StageStatusContext;
