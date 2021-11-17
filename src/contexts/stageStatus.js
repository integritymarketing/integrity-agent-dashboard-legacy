import React, { createContext, useState, useEffect, useMemo } from "react";
import clientsService from "services/clientsService";

const colorCodes = {
  blue: [
    {
      bg: "#DEEDFF",
      color: "#0052CE",
    },
  ],
  orange: [
    {
      bg: "#FFF2D1",
      color: "#8C6A0E",
    },
  ],
  green: [
    {
      bg: "#DBF5D9",
      color: "#357A2F",
    },
  ],
  grey: [
    {
      bg: "#EDEDED",
      color: "#151E29",
    },
  ],
};

const StageStatusContext = createContext({
  message: "",
  isVisible: false,
});

const getStageColor = (status) => {
  const statusColor =
    status === "New" || status === "Renewal"
      ? colorCodes.blue
      : status === "Applied"
      ? colorCodes.green
      : status === "Lost" || status === "Enrolled"
      ? colorCodes.grey
      : colorCodes.orange;
  return statusColor;
};

export const StageStatusProvider = (props) => {
  const [allStatuses, setAllStatuses] = useState([]);
  const statusOptions = useMemo(() => {
    return allStatuses.map((status) => ({
      value: status.statusName,
      label: status.statusName,
      color: status.colorCode || getStageColor(status.statusName),
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
  }, []);

  return (
    <StageStatusContext.Provider
      value={{ allStatuses, statusOptions, lostSubStatusesOptions, colorCodes }}
      {...props}
    />
  );
};

export default StageStatusContext;
