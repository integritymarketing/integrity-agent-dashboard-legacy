import React, { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";
import PropTypes from "prop-types";

/**
 * FinalExpensePlanListProvider component to provide final expenses plan context.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.Element} The rendered component.
 */

export const FinalExpensePlansListContext = createContext();

export const FinalExpensePlansProvider = ({ children }) => {
  const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/plans`;

  const {
    Get: fetchFinalExpensePlansList,
    loading: isLoadingFinalExpensePlans,
    error: finalExpensePlansError,
  } = useFetch(URL);

  const [finalExpensePlansList, setFinalExpensePlansList] = useState([]);

  const getFinalExpensePlansList = useCallback(
    async (quoteId) => {
      const data = await fetchFinalExpensePlansList(null, false, quoteId);
      setFinalExpensePlansList(data?.Results || []);
    },
    [fetchFinalExpensePlansList]
  );

  const fetchAndSetFilteredExpensePlans = useCallback(
    async (perPage, pageNumber, filterId, sortBy) => {
      const filteredURL = `?per_page=${perPage}&page=${pageNumber}&filterId=${filterId}&sort_by=${sortBy}`;
      const data = await fetchFinalExpensePlansList(filteredURL);
      setFinalExpensePlansList(data?.Results || []);
    },
    [fetchFinalExpensePlansList]
  );

  return (
    <FinalExpensePlansListContext.Provider value={getContextValue()}>
      {children}
    </FinalExpensePlansListContext.Provider>
  );

  function getContextValue() {
    return {
      getFinalExpensePlansList,
      finalExpensePlansList,
      finalExpensePlansError,
      isLoadingFinalExpensePlans,
      fetchAndSetFilteredExpensePlans,
    };
  }
};

FinalExpensePlansProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
