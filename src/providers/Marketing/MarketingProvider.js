import { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";
import * as Sentry from "@sentry/react";

import useFetch from "hooks/useFetch";

export const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const { npn } = useUserProfile();
    const showToast = useToast();

    const [completedCampaignsList, setCompletedCampaignsList] = useState([]);
    const [allCampaignsList, setAllCampaignsList] = useState([]);

    const URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/GetCampaignLog/${npn}`;

    const {
        Get: fetchCompletedCampaigns,
        loading: isFetchCompletedCampaignsLoading,
        error: fetchCompletedCampaignsError,
    } = useFetch(URL);

    /**
     * Fetch Campaigns details by email
     */
    const getCompletedCampaigns = useCallback(async () => {
        try {
            const resData = await fetchCompletedCampaigns();
            if (resData?.length) {
                setAllCampaignsList(resData);
                const filteredData = resData.filter((item) => item.campaignStatus === "Completed");
                setCompletedCampaignsList(filteredData);
            }
            return resData;
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to load data",
                time: 5000,
            });
        }
    }, [fetchCompletedCampaigns, showToast]);

    return <MarketingContext.Provider value={getContextValue()}>{children}</MarketingContext.Provider>;

    function getContextValue() {
        return {
            getCompletedCampaigns,
            isFetchCompletedCampaignsLoading,
            fetchCompletedCampaignsError,
            completedCampaignsList,
            allCampaignsList,
        };
    }
};

MarketingProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
