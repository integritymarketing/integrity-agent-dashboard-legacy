import React, { createContext, useState, useCallback, useMemo } from "react";
import useFetch from "hooks/useFetch";
import performAsyncOperation from "utilities/performAsyncOperation";
import PropTypes from "prop-types";

export const ScopeOfAppointmentContext = createContext();

export const ScopeOfAppointmentProvider = ({ children }) => {
    const URL = `${import.meta.env.VITE_LEADS_URL}/api/v2.0`;

    const { Get: fetchSoaList, loading: isSoaListLoading, error: soaListError } = useFetch(URL);
    const { Get: fetchSoaByLinkCode, loading: isLoadingSoaByLinkCodeLoading, error: soaByLinkCodeError, Post: editSoaByLinkCode } = useFetch(URL);

    const [soaList, setSoaList] = useState([]);
    const [soaByLinkcode, setSoaByLinkcode] = useState({});
    const [linkCode, setLinkCode] = useState(null);

    const getSoaList = useCallback(
        async (leadId) => {
            const path = `lead/${leadId}/Soa`;
            const data = await fetchSoaList(null, false, path);
            setSoaList(data || []);
        },
        [fetchSoaList]
    );

    const getSoaByLinkCode = useCallback(
        async (leadId, linkCode) => {
            const path = `lead/${leadId}/Soa/${linkCode}`;
            const data = await fetchSoaByLinkCode(null, false, path);
            setSoaByLinkcode(data || {});
        },
        [fetchSoaByLinkCode]
    );

    const updateSoaByLinkCode = async (payload, linkCode, callback) => {
        const path = `Soa/${linkCode}`;
        await performAsyncOperation(
            () => editSoaByLinkCode(payload, false, path),
            () => { },
            () => callback(),
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to save Scope Of Appointment`,
                })
        );
    };

    const contextValue = useMemo(
        () => ({
            getSoaList,
            soaList,
            soaListError,
            isSoaListLoading,
            getSoaByLinkCode,
            soaByLinkcode,
            soaByLinkCodeError,
            isLoadingSoaByLinkCodeLoading,
            updateSoaByLinkCode,
            linkCode,
            setLinkCode
        }),
        [
            getSoaList,
            soaList,
            soaListError,
            isSoaListLoading,
            getSoaByLinkCode,
            soaByLinkcode,
            soaByLinkCodeError,
            isLoadingSoaByLinkCodeLoading,
            updateSoaByLinkCode,
            linkCode,
            setLinkCode
        ]
    );

    return <ScopeOfAppointmentContext.Provider value={contextValue}>{children}</ScopeOfAppointmentContext.Provider>;
};

ScopeOfAppointmentProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
