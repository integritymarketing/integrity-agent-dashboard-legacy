import React, { createContext, useState, useEffect, useMemo } from "react";
import clientsService from "services/clientsService";

const colorCodes = {
  blue: [
    {
      bg: "#FFFFFF",
      color: "#0267FF",
    },
  ],
  orange: [
    {
      bg: "#FFFFFF",
      color: "#FFAB3B",
    },
  ],
  green: [
    {
      bg: "#FFFFFF",
      color: "#5AD76B",
    },
  ],
  grey: [
    {
      bg: "#FFFFFF",
      color: "#C1C1C1",
    },
  ],
  yellow: [
    {
      bg: "#FFFFFF",
      color: "#FFDE00",
    },
  ],
  red: [
    {
      bg: "#FFFFFF",
      color: "#FF675E",
    },
  ],
  blueMagenta: [
    {
      bg: "#FFFFFF",
      color: "#BF77E4",
    },
  ],
  skyBlue: [
    {
      bg: "#FFFFFF",
      color: "#67AEFF",
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
      ? colorCodes.green
      : status === "Contacted"
      ? colorCodes.yellow
      : status === "SOA Sent"
      ? colorCodes.orange
      : status === "SOA Signed"
      ? colorCodes.red
      : status === "Applied"
      ? colorCodes.skyBlue
      : status === "Quoted"
      ? colorCodes.blueMagenta
      : status === "Enrolled"
      ? colorCodes.blue
      : status === "Lost"
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
