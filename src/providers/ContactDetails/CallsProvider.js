import { createContext, useState, useCallback, useMemo } from "react";
import useFetch from "hooks/useFetch";

export const CallsContext = createContext();

export const CallsProvider = ({ children }) => {
    const URL = `${process.env.REACT_APP_COMMUNICATION_API}`;

    const { Get: fetchCallsList, loading: isLoadingCallsList, error: callsListError } = useFetch(URL);

    const [callsList, setCallsList] = useState([]);

    const getCallsList = useCallback(async (leadId) => {
        const path = `Call/Records?LeadId=${leadId}`;
        const data = await fetchCallsList(null, false, path);
        setCallsList(data || []);
    }, [fetchCallsList]);

    const contextValue = useMemo(() => ({
        getCallsList,
        callsList,
        callsListError,
        isLoadingCallsList
    }), [getCallsList, callsList, callsListError, isLoadingCallsList]);

    return <CallsContext.Provider value={contextValue}>{children}</CallsContext.Provider>
}