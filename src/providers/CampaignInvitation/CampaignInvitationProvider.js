/* eslint-disable max-lines-per-function */
import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import useToast from "hooks/useToast";
import useFetchCampaignLeads from "pages/ContactsList/hooks/useFetchCampaignLeads";
import * as Sentry from "@sentry/react";
import useUserProfile from "hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import useFetch from "hooks/useFetch";
import useAnalytics from "hooks/useAnalytics";

export const CampaignInvitationContext = createContext();

export const CampaignInvitationProvider = ({ children }) => {
    const [invitationSendType, setInvitationSendType] = useState("Email");
    const [filteredContactsType, setFilteredContactsType] = useState("all contacts");
    const [filteredContentStatus, setFilteredContentStatus] = useState("All Contacts");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);
    const [allContactsList, setAllContactsList] = useState([]);
    const [filteredContactsList, setFilteredContactsList] = useState([]);
    const [campaignInvitationData, setCampaignInvitationData] = useState(null);
    const [invitationName, setInvitationName] = useState("Campaign Details");
    const [invitationTemplateImage, setInvitationTemplateImage] = useState(null);
    const [campaignDescription, setCampaignDescription] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [agentAccountDetails, setAgentAccountDetails] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [agentPurlURL, setAgentPurlURL] = useState("");
    const [eligibleContactsLength, setEligibleContactsLength] = useState(0);
    const [filteredEligibleCount, setFilteredEligibleCount] = useState(0);

    const contactName = selectedContact ? `${selectedContact?.firstName} ${selectedContact?.lastName}` : null;
    const { agentId, npn, firstName, lastName, email, phone } = useUserProfile();
    const navigate = useNavigate();
    const showToast = useToast();
    const { fireEvent } = useAnalytics();

    const URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Campaign/Email`;
    const AGENT_PURL_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/Purl/npn/${npn}`;
    const AGENT_ACCOUNT_DETAILS_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/AgentMobile/Available/${agentId}`;
    const POST_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/Create`;

    const {
        Get: fetchCampaignDetailsByEmail,
        loading: isFetchCampaignDetailsByEmailLoading,
        error: fetchCampaignDetailsByEmailError,
    } = useFetch(URL);

    const { Post: startCampaign, loading: isStartCampaignLoading, error: startCampaignError } = useFetch(POST_URL);
    const { Get: fetchAgentPurl } = useFetch(AGENT_PURL_URL);
    const { Get: fetchAgentAccountDetails } = useFetch(AGENT_ACCOUNT_DETAILS_URL);

    const handleSummaryBarInfo = (result, label, total) => {
        const leadsList = result?.map((lead) => ({
            leadsId: lead?.leadsId,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            destination: invitationSendType === "Email" ? lead?.email || undefined : lead?.phone || undefined,
        }));
        setFilteredContactsList(leadsList);
        setFilteredCount(result ? result?.length : 0);
        setFilteredContentStatus(label);
        setFilteredEligibleCount(total);
    };

    useEffect(() => {
        handleSetDefaultSelection();
    }, []);

    const handleSetDefaultSelection = () => {
        setFilteredContactsType("all contacts");
        setFilteredContactsList([]);
        setFilteredCount(null);
        setSelectedContact(null);
    };

    const handleSelectedContact = (contact) => {
        setSelectedContact(contact);
        setFilteredContactsType("a contact");
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

    const { fetchTableDataWithoutFilters } = useFetchCampaignLeads();

    const fetchAllListCount = useCallback(async () => {
        const response = await fetchTableDataWithoutFilters({
            pageIndex: 1,
            pageSize: 12,
            searchString: null,
            sort: ["createDate:desc"],
            returnAll: true,
            campaignId: campaignInvitationData?.id,
        });
        setTotalContactsCount(response?.total);
        setEligibleContactsLength(response?.eligibleContactsLength);
        const leadsList = response?.leadsList?.map((lead) => ({
            leadsId: lead?.leadsId,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            destination: invitationSendType === "Email" ? lead?.email || undefined : lead?.phone || undefined,
        }));
        setAllContactsList(leadsList);
    }, [fetchTableDataWithoutFilters, invitationSendType, campaignInvitationData]);

    useEffect(() => {
        if (filteredContactsType === "all contacts") {
            fetchAllListCount();
        }
    }, [fetchAllListCount, filteredContactsType]);

    const handleCancel = () => {
        window.history.back();
    };

    const getCampaignDetailsByEmail = useCallback(async () => {
        try {
            const resData = await fetchCampaignDetailsByEmail(null, false);
            if (resData?.length) {
                const data = resData[0];
                setCampaignInvitationData(data);
                setInvitationTemplateImage(data?.templateImageUrl);
                setCampaignDescription(data?.campaignDescription);
                handleInvitationSendType(data?.campaignChannel);

                fireEvent("Campaign Initiated", {
                    page: currentPage,
                    campaignName: "Plan Enroll",
                    campaignDescription: data?.campaignDescription,
                });
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
        return null;
    }, [currentPage, fetchCampaignDetailsByEmail, fireEvent, showToast]);

    const getAgentAccountInformation = useCallback(async () => {
        try {
            const [agentAccountDetailsData, agentPurlURLData] = await Promise.all([
                fetchAgentAccountDetails(),
                fetchAgentPurl(),
            ]);

            setAgentAccountDetails(agentAccountDetailsData);
            setAgentPurlURL(agentPurlURLData);
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to load agent account information.",
                time: 5000,
            });
        }
    }, [fetchAgentAccountDetails, fetchAgentPurl, showToast]);

    const handleStartCampaign = useCallback(async () => {
        const templateId = campaignInvitationData?.templateId;

        let payload = {
            id: 0,
            agentId: agentId,
            agentNpn: npn,
            campaignType: "Blast",
            campaignStatus: "Submitted",
            customCampaignDescription: campaignDescription,
            campaignChannel: invitationSendType,
            requestPayload: {
                agentId: agentId,
                agentNPN: npn,
                channel: invitationSendType,
                agentFirstName: firstName,
                agentLastName: lastName,
                agentEmail: email,
                agentPhone: phone,
                templateId,
                custom1: `${process.env.REACT_APP_MEDICARE_ENROLL}/quick-profile?purl=${agentPurlURL?.agentPurlCode}`,
                custom2: "Integrity",
                custom3: agentAccountDetails?.agentVirtualPhoneNumber,
                custom4: `${process.env.REACT_APP_MEDICARE_ENROLL}/?purl=${agentPurlURL?.agentPurlCode}`,
                custom5: agentAccountDetails?.caLicense,
                eventTrigger: {
                    tags: [],
                    stage: {
                        logicalOperator: "",
                        value: "",
                        condition: "",
                    },
                    trigger: {},
                },
            },
        };

        if (filteredContactsType === "all contacts") {
            payload = {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: allContactsList,
                },
            };
        } else if (filteredContactsType === "contacts filtered by ..") {
            payload = {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: filteredContactsList,
                },
            };
        } else {
            payload = {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: [
                        {
                            leadsId: selectedContact.leadsId,
                            firstName: selectedContact.firstName,
                            lastName: selectedContact.lastName,
                            destination:
                                invitationSendType === "Email"
                                    ? selectedContact?.email || undefined
                                    : selectedContact?.phone || undefined,
                        },
                    ],
                },
            };
        }
        try {
            const resData = await startCampaign(payload, false);
            if (resData) {
                showToast({
                    message: "Campaign sent successfully",
                    time: 5000,
                });
                handleSetDefaultSelection();

                fireEvent("Campaign Started", {
                    campaignName: "Plan Enroll",
                    campaignDescription: campaignDescription,
                    scope:
                        filteredContactsType === "contacts filtered by .."
                            ? "filter contacts"
                            : filteredContactsType === "all contacts"
                              ? "all contacts"
                              : "search for a contact",
                });
                navigate("/marketing/campaign-dashboard");
            }
            return resData;
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Error sending campaign please try again.",
                time: 5000,
            });
        }
        return null;
    }, [
        startCampaign,
        fireEvent,
        showToast,
        campaignInvitationData,
        filteredContactsType,
        allContactsList,
        filteredContactsList,
        selectedContact,
        agentId,
        npn,
        campaignDescription,
        invitationSendType,
        firstName,
        lastName,
        email,
        phone,
        agentAccountDetails,
        agentPurlURL,
        navigate,
    ]);

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
            handleInvitationName,
            handleInvitationTemplateImage,
            invitationName,
            invitationTemplateImage,
            handleCancel,
            handleSummaryBarInfo,
            getCampaignDetailsByEmail,
            isFetchCampaignDetailsByEmailLoading,
            fetchCampaignDetailsByEmailError,
            campaignInvitationData,
            campaignDescription,
            setSelectedContact,
            selectedContact,
            contactName,
            setFilteredContactsType,
            handleStartCampaign,
            isStartCampaignLoading,
            startCampaignError,
            filteredContactsList,
            allContactsList,
            getAgentAccountInformation,
            setCurrentPage,
            currentPage,
            handleSelectedContact,
            handleSetDefaultSelection,
            eligibleContactsLength,
            filteredEligibleCount,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
