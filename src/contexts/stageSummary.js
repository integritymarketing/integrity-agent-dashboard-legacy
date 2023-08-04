import React, { createContext, useState } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";

const StageSummaryContext = createContext({});

const SORT_BY_ORDER = {
  New: 1,
  Renewal: 2,
  Contacted: 3,
  "Soa Sent": 4,
  "Soa Signed": 5,
  Quoted: 6,
  Applied: 7,
  Enrolled: 8,
};

export const StageSummaryProvider = (props) => {
  const { clientsService } = useClientServiceContext();
  const [stageSummaryData, setStageSummaryData] = useState([]);
  const addToast = useToast();

  const loadStageSummaryData = async () => {
    try {
      await clientsService.getDashbaordSummary().then((response) => {
        setStageSummaryData(
          response.sort((a, b) => {
            return (
              (SORT_BY_ORDER[a.statusName] || 1000) -
              (SORT_BY_ORDER[b.statusName] || 1000)
            );
          })
        );
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to load data",
      });
    }
  };

  return (
    <StageSummaryContext.Provider
      value={{
        stageSummaryData,
        loadStageSummaryData,
      }}
      {...props}
    />
  );
};

export default StageSummaryContext;
