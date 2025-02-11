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

export const LifeContext = createContext();

export const LifeProvider = ({ children }) => {
  const URL = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/FinalExpenses`;

  const {
    Get: fetchLifeDetails,
    loading: isLoadingLifeDetails,
    error: lifeDetailsError,
  } = useFetch(`${URL}/lead`);

  const {
    Post: createLifeDetails,
    loading: isLoadingCreateLifeDetails,
    error: createLifeDetailsError,
  } = useFetch(`${URL}/Create`);

  const {
    Post: updateLifeDetails,
    loading: isLoadingUpdateLifeDetails,
    error: updateLifeDetailsError,
  } = useFetch(`${URL}/Update`);

  const [lifeDetails, setLifeDetails] = useState(null);

  const getLifeDetails = useCallback(
    async (id) => {
      const data = await fetchLifeDetails(null, false, id);
      if (data && data?.length > 0) {
        setLifeDetails(data?.[data?.length - 1] || null);
      }
      if (lifeDetailsError) {
        throw new Error("Fetch failed.");
      }
    },
    [fetchLifeDetails] //react-hooks/exhaustive-deps
  );

  const saveLifeDetails = useCallback(
    async (body, id) => {
      const data = await createLifeDetails(body);
      if (data && !createLifeDetailsError && !isLoadingCreateLifeDetails) {
        getLifeDetails(id);
      }
      if (createLifeDetailsError) {
        throw new Error("Save failed.");
      }
    },
    [createLifeDetails] //react-hooks/exhaustive-deps
  );

  const editLifeDetails = useCallback(
    async (body, id) => {
      const data = await updateLifeDetails(body);
      if (data && !updateLifeDetailsError && !isLoadingUpdateLifeDetails) {
        getLifeDetails(id);
      }
      if (updateLifeDetailsError) {
        throw new Error("Update failed.");
      }
    },
    [updateLifeDetails] //react-hooks/exhaustive-deps
  );

  return (
    <LifeContext.Provider value={getContextValue()}>
      {children}
    </LifeContext.Provider>
  );

  function getContextValue() {
    return {
      getLifeDetails,
      saveLifeDetails,
      editLifeDetails,
      lifeDetails,
      isLoadingLifeDetails,
      lifeDetailsError,
      isLoadingCreateLifeDetails,
      createLifeDetailsError,
      isLoadingUpdateLifeDetails,
      updateLifeDetailsError,
    };
  }
};

LifeProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
