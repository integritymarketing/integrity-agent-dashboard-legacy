import { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";
import PropTypes from "prop-types";

export const PoliciesContext = createContext();

export const PoliciesProvider = ({ children }) => {
    const URL = `${import.meta.env.VITE_BOOKOFBUSINESS_API}/lead`; //

    const { Get: fetchEnrollPlansList, loading: isLoadingEnrollPlansList, error: enrollPlansListError } = useFetch(URL);

    const [enrollPlansList, setEnrollPlansList] = useState([]);

    const getEnrollPlansList = useCallback(
        async (leadId) => {
            const data = await fetchEnrollPlansList(null, false, leadId);
            setEnrollPlansList(data || []); // TODO
        },
        [fetchEnrollPlansList]
    );

    return <PoliciesContext.Provider value={getContextValue()}>{children}</PoliciesContext.Provider>;

    function getContextValue() {
        return {
            getEnrollPlansList,
            enrollPlansList,
            enrollPlansListError,
            isLoadingEnrollPlansList,
        };
    }
};

PoliciesProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
