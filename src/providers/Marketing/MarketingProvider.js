import { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";

import useFetch from "hooks/useFetch";

export const MarketingContext = createContext();

export const MarketingProvider = ({ children }) => {
    const { npn } = useUserProfile();
    const navigate = useNavigate();
    const showToast = useToast();

    const [completedCampaignsList, setCompletedCampaignsList] = useState([]);
    const [allCampaignsList, setAllCampaignsList] = useState([]);
    const [emailData,  setEmailData] = useState([]);
    const [smsData, setSmsData] = useState([]);

    const URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/GetCampaignLog/${npn}`;
    const COPY_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/Create`;
    const UPDATE_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/Update`;
    const DELETE_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog`;
    const {
        Get: fetchCompletedCampaigns,
        loading: isFetchCompletedCampaignsLoading,
        error: fetchCompletedCampaignsError,
    } = useFetch(URL);

    const {
        Put: updateCampaign,
        loading: isUpdateCampaignLoading,
        error: updateCampaignError,
    } = useFetch(UPDATE_CAMPAIGN_URL);
    const {
        Post: createCampaign,
        loading: isCreateCampaignLoading,
        error: createCampaignError,
    } = useFetch(COPY_CAMPAIGN_URL);
    const {
        Delete: deleteCampaign,
        loading: isDeleteCampaignLoading,
        error: deleteCampaignError,
    } = useFetch(DELETE_CAMPAIGN_URL);

    /**
     * Fetch Campaigns details by email
     */
    const getCompletedCampaigns = useCallback(async () => {
        try {
            const resData = await fetchCompletedCampaigns();
            if (resData?.length) {
                const sortAllCampaignsList = resData.sort((a, b) => {
                    const dateA = new Date(a.modifiedDateTime);
                    const dateB = new Date(b.modifiedDateTime);
                    return dateB - dateA;
                });
                setAllCampaignsList(sortAllCampaignsList);
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

    const handleAllCampaignActions = useCallback(
        async ({ payload, method, refresh }) => {
            try {
                let resData = null;
                if (method === "put") {
                    resData = await updateCampaign(payload);
                } else if (method === "post") {
                    resData = await createCampaign(payload);
                } else if (method === "delete") {
                    const campaignId = payload.id;
                    resData = await deleteCampaign(null, true, campaignId);
                }
                if (resData && method === "put") {
                    if (refresh) {
                        await refresh(resData?.id);
                    } else {
                        await getCompletedCampaigns();
                    }
                    showToast({
                        type: "success",
                        message: "Campaign updated successfully",
                        time: 5000,
                    });
                }
                if (resData && method === "delete") {
                    showToast({
                        type: "success",
                        message: "Campaign deleted successfully",
                        time: 5000,
                    });
                    if (refresh) {
                        navigate("/marketing/client-connect-marketing");
                    } else {
                        await getCompletedCampaigns();
                    }
                }
                if (resData && method === "post") {
                    navigate(`/marketing/campaign-details/${resData.id}`);
                }
                return resData;
            } catch (error) {
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: `Failed to ${
                        method === "put" ? "update" : method === "post" ? "create" : "delete"
                    } campaign`,
                    time: 5000,
                });
            }
        },
        [deleteCampaign, updateCampaign, createCampaign, showToast, navigate],
    );

    return <MarketingContext.Provider value={getContextValue()}>{children}</MarketingContext.Provider>;

    function getContextValue() {
        return {
            getCompletedCampaigns,
            isFetchCompletedCampaignsLoading,
            fetchCompletedCampaignsError,
            completedCampaignsList,
            allCampaignsList,
            handleAllCampaignActions,
            isUpdateCampaignLoading,
            updateCampaignError,
            isCreateCampaignLoading,
            createCampaignError,
            isDeleteCampaignLoading,
            deleteCampaignError,
            emailData,
            setEmailData,
            smsData,
            setSmsData,
        };
    }
};

MarketingProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
