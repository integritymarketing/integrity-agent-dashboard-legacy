import React, { createContext, useState, useEffect, useMemo } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";

const StageStatusContext = createContext({
  message: "",
  isVisible: false,
});

export const StageStatusProvider = (props) => {
  const { clientsService } = useClientServiceContext();
  const [allStatuses, setAllStatuses] = useState([]);
  const statusOptions = useMemo(() => {
    return allStatuses.map((status) => ({
      value: status.statusName,
      label: status.statusName,
      color: status.hexValue,
      statusId: status.leadStatusId,
    }));
  }, [allStatuses]);

  const lostSubStatusesOptions = useMemo(() => {
    return allStatuses
      .filter(({ statusName }) => statusName === "Lost")[0]
      ?.leadSubStatus?.map(({ leadStatusId: value, statusName: label }) => ({
        value,
        label,
      }));
  }, [allStatuses]);

  useEffect(() => {
    const doFetch = async () => {
      const statuses = await clientsService.getStatuses();
      setAllStatuses(statuses);
    };
    doFetch();
  }, [clientsService]);

  return (
    <StageStatusContext.Provider
      value={{ allStatuses, statusOptions, lostSubStatusesOptions }}
      {...props}
    />
  );
};

export default StageStatusContext;
