import React, { createContext, useState, useEffect, useCallback } from "react";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";
import PropTypes from "prop-types";

/**
 * FinalExpensesPlanListProvider component to provide final expenses plan context.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.Element} The rendered component.
 */

export const FinalExpensesPlansListContext = createContext();

export const FinalExpensesPlansListProvider = ({ children }) => {
  const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/plans`;

  const {
    Get: fetchFinalExpensesPlansList,
    loading: finalExpensesPlansLoading,
    error: finalExpensesPlansError,
  } = useFetch(URL);

  const [finalExpensesPlansList, setFinalExpensesPlansList] = useState([]);

  // Fetch
  const getFinalExpensesPlansList = useCallback(
    async (quoteId) => {
      const data = await fetchFinalExpensesPlansList(null, false, quoteId);
      setFinalExpensesPlansList(data?.Results || []);
    },
    [fetchFinalExpensesPlansList]
  );

  // New method to fetch filtered data
  const filterFinalExpensesPlansList = useCallback(
    async (perPage, pageNumber, filterId, sortBy) => {
      const filteredURL = `?per_page=${perPage}&page=${pageNumber}&filterId=${filterId}&sort_by=${sortBy}`;
      const data = await fetchFinalExpensesPlansList(filteredURL);
      setFinalExpensesPlansList(data?.Results || []);
    },
    [fetchFinalExpensesPlansList]
  );

  console.log("CONTEXT", finalExpensesPlansList);

  return (
    <FinalExpensesPlansListContext.Provider value={getContextValue()}>
      {children}
    </FinalExpensesPlansListContext.Provider>
  );

  function getContextValue() {
    return {
      getFinalExpensesPlansList,
      finalExpensesPlansList,
      finalExpensesPlansError,
      finalExpensesPlansLoading,
      filterFinalExpensesPlansList,
    };
  }
};

FinalExpensesPlansListProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
