import React, { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";

import PropTypes from "prop-types";

export const DuplicateContactsContext = createContext();


const getFormattedPhone = (phone) =>
    phone ? ("" + phone).replace(/\D/g, "") : null;


export const DuplicateContactsProvider = ({ children }) => {

    const URL = `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads`;

    const leadsApiUrl = `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads`;

    const { Get: fetchLeadDetails, loading: isLoadingLeadDetails, error: leadDetailsError, } = useFetch(leadsApiUrl);



    const { Post: fetchDuplicateContacts, loading: isLoadingDuplicateContacts, error: duplicateContactsError } = useFetch(URL);

    const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
    const [duplicateLeadIdName, setDuplicateLeadIdName] = useState("");

    const getLeadDetails = useCallback(
        async (leadId) => {
            try {
                const data = await fetchLeadDetails(null, false, leadId);
                if (data) {
                    const { firstName, middleName, lastName } = data;
                    setDuplicateLeadIdName(`${firstName} ${middleName || ""} ${lastName}`);
                }
                else setDuplicateLeadIdName(null);
            } catch (error) {
                console.error("Error fetching Lead details:", error);
                // Handle error appropriately here
            }
        },
        [fetchLeadDetails]
    );

    const getDuplicateContacts = useCallback(
        async (payload) => {
            const { firstName, lastName, email, phones, leadId } = payload;
            const reqData = {
                firstName,
                lastName,
                leadId,
            };

            if (!email && !phones?.leadPhone) {
                return {};
            }

            if (email) {
                reqData.emails = [
                    {
                        leadEmail: email,
                    },
                ];
            }
            if (phones?.leadPhone) {
                reqData.phones = [
                    {
                        ...phones,
                        leadPhone: getFormattedPhone(phones.leadPhone),
                    },
                ];
            }

            const path = `GetDuplicateContact`;
            const data = await fetchDuplicateContacts(reqData, false, path)
            if (data?.duplicateLeadIds?.length === 1) {
                const { duplicateLeadIds } = data;
                const duplicateLeadId = duplicateLeadIds[0];
                getLeadDetails(duplicateLeadId);
                if (data.isPartialDuplicate && duplicateLeadId !== leadId) {
                    setDuplicateLeadIds(duplicateLeadIds);
                }
            } else {
                const { duplicateLeadIds } = data;
                const duplicateLeadId = duplicateLeadIds[0];
                if (data?.isPartialDuplicate && duplicateLeadId !== leadId) {
                    setDuplicateLeadIds(duplicateLeadIds);
                }
            }
        },
        [fetchDuplicateContacts]
    );

    return <DuplicateContactsContext.Provider value={getContextValue()}>{children}</DuplicateContactsContext.Provider>;

    function getContextValue() {
        return {
            getDuplicateContacts,
            duplicateLeadIds,
            duplicateContactsError,
            isLoadingDuplicateContacts,
            duplicateLeadIdName,

        };
    }
};

DuplicateContactsProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
