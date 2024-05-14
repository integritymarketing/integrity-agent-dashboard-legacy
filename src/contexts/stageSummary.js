import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";
import { createContext, useCallback, useState } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

const StageSummaryContext = createContext({});

const SORT_ORDER = {
    New: 1,
    Renewal: 2,
    Contacted: 3,
    "Soa Sent": 4,
    "Soa Signed": 5,
    Quoted: 6,
    Applied: 7,
    Enrolled: 8,
};

export const StageSummaryProvider = ({ children }) => {
    const [stageSummary, setStageSummary] = useState([]);
    const { clientsService } = useClientServiceContext();
    const showToastNotification = useToast();

    const loadStageSummary = useCallback(async () => {
        try {
            const response = await clientsService.getDashbaordSummary();
            if (response) {
                const sortedData = response.sort((a, b) => {
                    return (SORT_ORDER[a.statusName] || 1000) - (SORT_ORDER[b.statusName] || 1000);
                });
                setStageSummary(sortedData);
            }
        } catch (error) {
            Sentry.captureException(error);
            showToastNotification({
                type: "error",
                message: "Failed to load stage summary data",
            });
        }
    }, [clientsService, showToastNotification]);

    return (
        <StageSummaryContext.Provider
            value={{
                stageSummary,
                loadStageSummary,
            }}
        >
            {children}
        </StageSummaryContext.Provider>
    );
};

StageSummaryProvider.propTypes = {
    // Children components that will consume the context data
    children: PropTypes.node.isRequired,
};

export default StageSummaryContext;
