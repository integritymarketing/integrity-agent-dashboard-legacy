import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useFetchTableData from "pages/ContactsList/hooks/useFetchTableData";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";

import useFetch from "hooks/useFetch";

export const CampaignInvitationContext = createContext();

export const CampaignInvitationProvider = ({ children }) => {
    const [invitationSendType, setInvitationSendType] = useState("Email");
    const [filteredContactsType, setFilteredContactsType] = useState("all my contacts");
    const [filteredContentStatus, setFilteredContentStatus] = useState("All Contacts");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);
    const [leadIdsList, setLeadIdsList] = useState([]);
    const [campaignInvitationData, setCampaignInvitationData] = useState(null);
    const [invitationName, setInvitationName] = useState("");
    const [invitationTemplateImage, setInvitationTemplateImage] = useState(null);
    const [campaignDescription, setCampaignDescription] = useState("");

    const showToast = useToast();

    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Campaign/Email`;

    const {
        Get: fetchCampaignDetailsByEmail,
        loading: isFetchCampaignDetailsByEmailLoading,
        error: fetchCampaignDetailsByEmailError,
    } = useFetch(URL);

    const handleSummaryBarInfo = (total, result, label) => {
        setFilteredCount(result ? result?.length : 0);
        setFilteredContentStatus(label);
    };

    const handleInvitationName = (name) => {
        setInvitationName(name);
    };

    const handleInvitationTemplateImage = (image) => {
        setInvitationTemplateImage(image);
    };

    const handleInvitationSendType = (type) => {
        setInvitationSendType(type);
    };

    const handleFilteredContactsTypeChange = (type) => {
        setFilteredContactsType(type);
        if (type === "Filter my contacts") {
            setFilteredContentStatus("");
        } else {
            setFilteredContentStatus("All Contacts");
            setFilteredCount(null);
        }
    };

    const { fetchTableDataWithoutFilters } = useFetchTableData();

    const fetchAllListCount = useCallback(async () => {
        if (!totalContactsCount) {
            const response = await fetchTableDataWithoutFilters({
                pageIndex: 1,
                pageSize: 12,
                searchString: null,
                sort: ["createDate:desc"],
            });
            setTotalContactsCount(response?.total);
            setLeadIdsList(response?.leadIdsList);
        }
    }, [totalContactsCount, fetchTableDataWithoutFilters]);

    useEffect(() => {
        fetchAllListCount();
    }, [fetchAllListCount]);

    const handleSendInvitation = () => {
        // Send invitation logic
    };

    const handleCancel = () => {
        // Cancel invitation logic
    };

    /**
     * Fetch agent account data and update state.
     */
    const getCampaignDetailsByEmail = useCallback(async () => {
        try {
            const resData = await fetchCampaignDetailsByEmail(null, false);
            if (resData?.length) {
                const data = resData[0];
                console.log(data);
                setCampaignInvitationData(data);
                setInvitationName(data?.campaignName);
                setInvitationTemplateImage(data?.templateImageUrl);
                setCampaignDescription(data?.campaignDescription);
                handleInvitationSendType(data?.campaignChannel);
            }
            return data;
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to load data",
                time: 5000,
            });
        }
    }, [fetchCampaignDetailsByEmail, showToast]);

    return (
        <CampaignInvitationContext.Provider value={getContextValue()}>{children}</CampaignInvitationContext.Provider>
    );

    function getContextValue() {
        return {
            invitationSendType,
            filteredContactsType,
            filteredContentStatus,
            filteredCount,
            totalContactsCount,
            handleInvitationSendType,
            handleFilteredContactsTypeChange,
            handleInvitationName,
            handleInvitationTemplateImage,
            invitationName,
            invitationTemplateImage,
            handleSendInvitation,
            handleCancel,
            handleSummaryBarInfo,
            leadIdsList,
            getCampaignDetailsByEmail,
            isFetchCampaignDetailsByEmailLoading,
            fetchCampaignDetailsByEmailError,
            campaignInvitationData,
            campaignDescription,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
