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
    const [invitationSendType, setInvitationSendType] = useState("");
    const [filteredContactsType, setFilteredContactsType] = useState("");
    const [filteredContentStatus, setFilteredContentStatus] = useState("");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);
    const [allContactsList, setAllContactsList] = useState([]);
    const [filteredContactsList, setFilteredContactsList] = useState([]);
    const [allCampaignInvitationData, setAllCampaignInvitationData] = useState([]);
    const [campaignInvitationData, setCampaignInvitationData] = useState("");
    const [invitationName, setInvitationName] = useState("Campaign Details");
    const [invitationTemplateImage, setInvitationTemplateImage] = useState(null);
    const [campaignDescription, setCampaignDescription] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);
    const [agentAccountDetails, setAgentAccountDetails] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [agentPurlURL, setAgentPurlURL] = useState("");
    const [eligibleContactsLength, setEligibleContactsLength] = useState(0);
    const [filteredEligibleCount, setFilteredEligibleCount] = useState(0);
    const [createdNewCampaign, setCreatedNewCampaign] = useState(null);
    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

    const contactName = selectedContact ? `${selectedContact?.firstName} ${selectedContact?.lastName}` : null;
    const { agentId, npn, firstName, lastName, email, phone } = useUserProfile();
    const navigate = useNavigate();
    const showToast = useToast();
    const { fireEvent } = useAnalytics();

    const campaignStatuses = { DRAFT: "Draft", SUBMITTED: "Submitted", COMPLETED: "Completed" };
    const EMAIL_URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Campaign/Email`;
    const TEXT_URL = `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Campaign/sms`;
    const AGENT_PURL_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/Purl/npn/${npn}`;
    const AGENT_ACCOUNT_DETAILS_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/AgentMobile/Available/${agentId}`;
    const CREATE_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/Create`;
    const UPDATE_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog/Update`;

    const {
        Get: fetchCampaignDetailsByEmail,
        loading: isFetchCampaignDetailsByEmailLoading,
        error: fetchCampaignDetailsByEmailError,
    } = useFetch(EMAIL_URL);

    const {
        Get: fetchCampaignDetailsByText,
        loading: isFetchCampaignDetailsByTextLoading,
        error: fetchCampaignDetailsByTextError,
    } = useFetch(TEXT_URL);

    const {
        Post: startCampaign,
        loading: isStartCampaignLoading,
        error: startCampaignError,
    } = useFetch(CREATE_CAMPAIGN_URL);
    const {
        Put: updateCampaign,
        loading: isUpdateCampaignLoading,
        error: updateCampaignError,
    } = useFetch(UPDATE_CAMPAIGN_URL);
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

    useEffect(() => {
        if (createdNewCampaign?.id) {
            handleCreateOrUpdateCampaign(campaignStatuses.DRAFT);
        }
    }, [
        campaignInvitationData,
        invitationSendType,
        filteredContactsType,
        filteredContactsList,
        allContactsList,
        selectedContact,
    ]);

    const handleSetDefaultSelection = () => {
        setFilteredContactsType("");
        setFilteredContactsList([]);
        setFilteredCount(null);
        setSelectedContact(null);
        setInvitationSendType("");
        setCampaignInvitationData("");
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
            (async () => {
                await fetchAllListCount();
            })();
        }
    }, [fetchAllListCount, filteredContactsType]);

    const reset = () => {
        setCreatedNewCampaign(null);
        handleSetDefaultSelection();
    };

    const getCampaignDetailsByEmail = useCallback(async () => {
        try {
            const resData = await fetchCampaignDetailsByEmail(null, false);
            if (resData?.length) {
                setAllCampaignInvitationData(resData);
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

    const getCampaignDetailsByText = useCallback(async () => {
        try {
            const resData = await fetchCampaignDetailsByText(null, false);
            if (resData?.length) {
                setAllCampaignInvitationData(resData);
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

    const handleCampaignInvitationData = (data) => {
        handleSetDefaultSelection();
        setCampaignInvitationData(data);
        setInvitationTemplateImage(data?.templateImageUrl);
        handleInvitationSendType(data?.campaignChannel);
    };

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

    const createCampaignRequestPayload = (status) => {
        return {
            id: 0,
            agentId: agentId,
            agentNpn: npn,
            campaignType: "Blast",
            campaignStatus: status,
            customCampaignDescription: campaignDescription,
            campaignChannel: "Email",
            requestPayload: {
                leads: [],
                agentId: 0,
                agentNPN: "",
                channel: "",
                agentFirstName: "",
                agentLastName: "",
                agentEmail: "",
                agentPhone: "",
                templateId: "",
                custom1: "",
                custom2: null,
                custom3: null,
                custom4: null,
                custom5: null,
            },
        };
    };

    const updateCampaignRequestPayload = (campaignStatus) => {
        const templateId = campaignInvitationData?.templateId;
        const payload = {
            id: createdNewCampaign?.id || 0,
            agentId: agentId,
            agentNpn: npn,
            campaignType: "Blast",
            campaignStatus: campaignStatus,
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
            return {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: allContactsList,
                },
            };
        } else if (filteredContactsType === "contacts filtered by ..") {
            return {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: filteredContactsList,
                },
            };
        } else if (selectedContact?.leadsId) {
            return {
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
        } else {
            return {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: [],
                },
            };
        }
    };

    const handleCreateOrUpdateCampaign = useCallback(
        async (status, redirectTo) => {
            const isUpdate = createdNewCampaign && createdNewCampaign?.id;
            try {
                let resData = null;
                if (isUpdate) {
                    resData = await updateCampaign(updateCampaignRequestPayload(status), false);
                } else {
                    resData = await startCampaign(createCampaignRequestPayload(status), false);
                }
                if (resData) {
                    setCreatedNewCampaign(resData);
                    fireEvent("Campaign Created/Updated", {
                        campaignName: campaignInvitationData?.campaignName,
                        campaignDescription: campaignDescription,
                        scope:
                            filteredContactsType === "contacts filtered by .."
                                ? "filter contacts"
                                : filteredContactsType === "all contacts"
                                  ? "all contacts"
                                  : "search for a contact",
                    });
                    if (redirectTo) {
                        navigate(redirectTo);
                    }
                }
                return resData;
            } catch (error) {
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: `Error while ${isUpdate ? "updating" : "creating"} campaign. Please try again.`,
                    time: 5000,
                });
            }
            return null;
        },
        [
            createCampaignRequestPayload,
            updateCampaignRequestPayload,
            updateCampaign,
            createdNewCampaign,
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
        ],
    );

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
            reset,
            handleSummaryBarInfo,
            getCampaignDetailsByEmail,
            isFetchCampaignDetailsByEmailLoading,
            fetchCampaignDetailsByEmailError,
            getCampaignDetailsByText,
            isFetchCampaignDetailsByTextLoading,
            fetchCampaignDetailsByTextError,
            campaignInvitationData,
            handleCampaignInvitationData,
            campaignDescription,
            setCampaignDescription,
            setSelectedContact,
            selectedContact,
            contactName,
            setFilteredContactsType,
            handleCreateOrUpdateCampaign,
            isStartCampaignLoading,
            isUpdateCampaignLoading,
            startCampaignError,
            updateCampaignError,
            filteredContactsList,
            allContactsList,
            getAgentAccountInformation,
            setCurrentPage,
            currentPage,
            handleSelectedContact,
            handleSetDefaultSelection,
            eligibleContactsLength,
            filteredEligibleCount,
            allCampaignInvitationData,
            createdNewCampaign,
            campaignStatuses,
            isCreateCampaignModalOpen,
            setIsCreateCampaignModalOpen,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
