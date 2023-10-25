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

export const FinalExpensePlansContext = createContext();

export const FinalExpensePlansProvider = ({ children }) => {
  const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses/plans`;

  const {
    Get: fetchFinalExpensePlans,
    loading: isLoadingFinalExpensePlans,
    error: finalExpensePlansError,
  } = useFetch(URL);

  const [finalExpensePlans, setFinalExpensePlans] = useState([]);

  const getFinalExpensePlans = useCallback(
    async (quoteId) => {
      const data = await fetchFinalExpensePlans(null, false, quoteId);
      setFinalExpensePlans(data?.Results || []);
    },
    [fetchFinalExpensePlans]
  );

  const fetchAndSetFilteredExpensePlans = useCallback(
    async (perPage, pageNumber, filterId, sortBy) => {
      const filteredURL = `?per_page=${perPage}&page=${pageNumber}&filterId=${filterId}&sort_by=${sortBy}`;
      const data = await fetchFinalExpensePlans(filteredURL);
      setFinalExpensePlans(data?.Results || []);
    },
    [fetchFinalExpensePlans]
  );

  return (
    <FinalExpensePlansContext.Provider value={getContextValue()}>
      {children}
    </FinalExpensePlansContext.Provider>
  );

  function getContextValue() {
    return {
      getFinalExpensePlans,
      finalExpensePlans,
      finalExpensePlansError,
      isLoadingFinalExpensePlans,
      fetchAndSetFilteredExpensePlans,
    };
  }
};

FinalExpensePlansProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
