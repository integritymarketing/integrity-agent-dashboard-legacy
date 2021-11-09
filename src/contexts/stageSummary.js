import React, { createContext, useState } from "react";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";

const StageSummaryContext = createContext({});

const SORT_BY_ORDER = {
  New: 1,
  Renewal: 2,
  Contacted: 3,
  SoaSent: 4,
  SoaSigned: 5,
  Quoted: 6,
  Applied: 7,
  Enrolled: 8,
};

export const StageSummaryProvider = (props) => {
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
