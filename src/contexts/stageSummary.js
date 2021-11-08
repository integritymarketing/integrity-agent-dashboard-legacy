import React, { createContext, useState, useEffect, useContext } from "react";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import AuthContext from "contexts/auth";

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
  const auth = useContext(AuthContext);
  const [stageSummaryData, setStageSummaryData] = useState([]);
  const addToast = useToast();

  const getStageSummaryData = async () => {
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

  useEffect(() => {
    if (auth.isAuthenticated()) {
      getStageSummaryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <StageSummaryContext.Provider
      value={{
        stageSummaryData,
        getStageSummaryData: () => getStageSummaryData(),
      }}
      {...props}
    />
  );
};

export default StageSummaryContext;
