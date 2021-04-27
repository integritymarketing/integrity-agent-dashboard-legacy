import React, { useEffect, useState, useMemo } from "react";
import { ColorOptionRender } from "../../../utils/shared-utils/sharedUtility";
import { Select } from "components/ui/Select";
import clientsService from "services/clientsService";
// import useToast from '../../../hooks/useToast';
import * as Sentry from "@sentry/react";

const colorCodes = {
  New: "#2082F5",
  Quoted: "#EDB72C",
  Lost: "#565656",
  Enrolled: "#565656",
  Open: "Orange",
  Applied: "#65C15D"
};

export default ({value, original}) => {
    const [allStatuses, setAllStatuses] = useState([]);
    // const addToast = useToast();

    useEffect(() => {
        const doFetch = async () => {
          const statuses = await clientsService.getStatuses();
          setAllStatuses(statuses);
        };
    
        doFetch();
      }, []);


      const statusOptions = useMemo(() => {
        return allStatuses.map(status => ( {
          value: status.statusName,
          label: status.statusName,
          color: status.colorCode || colorCodes[status.statusName] || "#EDB72C",
        }));
      }, [allStatuses]); 


  const handleChangeStatus = async (val) => {
    try {
      await clientsService.updateClient(original, {
        ...original,
        leadStatusId: allStatuses.find((status) => status.statusName === val)
          ?.leadStatusId,
      });
    //   addToast({
    //     type: "success",
    //     message: "Contact successfully updated.",
    //     time: 3000,
    //   });
    } catch (e) {
      Sentry.captureException(e);
    }
  };

  return (
    <React.Fragment>
    <Select
      Option={ColorOptionRender}
      initialValue={value}
      options={statusOptions}
      onChange={handleChangeStatus}
      contactRecordPage={true}
      />
    </React.Fragment>
  );
};
