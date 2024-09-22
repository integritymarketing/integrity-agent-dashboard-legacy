/* eslint-disable max-lines-per-function */
import { createContext, useEffect, useState, useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import useToast from "hooks/useToast";
import useFetchCampaignLeads from "pages/ContactsList/hooks/useFetchCampaignLeads";
import * as Sentry from "@sentry/react";
import useUserProfile from "hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import useFetch from "hooks/useFetch";
import useAnalytics from "hooks/useAnalytics";
import StageStatusContext from "contexts/stageStatus";

export const CampaignInvitationContext = createContext();

export const CampaignInvitationProvider = ({ children }) => {
    const [filteredContentStatus, setFilteredContentStatus] = useState("");
    const [filteredCount, setFilteredCount] = useState(null);
    const [totalContactsCount, setTotalContactsCount] = useState(0);
    const [allContactsList, setAllContactsList] = useState([]);
    const [filteredContactsList, setFilteredContactsList] = useState([]);
    const [allCampaignInvitationData, setAllCampaignInvitationData] = useState([]);

    const [selectedContact, setSelectedContact] = useState(null);
    const [agentAccountDetails, setAgentAccountDetails] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [agentPurlURL, setAgentPurlURL] = useState("");
    const [eligibleContactsLength, setEligibleContactsLength] = useState(0);
    const [filteredEligibleCount, setFilteredEligibleCount] = useState(0);
    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

    const [campaignName, setCampaignName] = useState("");
    const [campaignStatus, setCampaignStatus] = useState("");
    const [campaignChannel, setCampaignChannel] = useState("");
    const [campaignDescriptionType, setCampaignDescriptionType] = useState("");
    const [campaignActionType, setCampaignActionType] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [templateImageUrl, setTemplateImageUrl] = useState("");
    const [templateDescription, setTemplateDescription] = useState("");
    const [templateDetails, setTemplateDetails] = useState([]);
    const [campaignId, setCampaignId] = useState(0);
    const [contactSearchId, setContactSearchId] = useState(null);
    const [campaignActions, setCampaignActions] = useState([]);
    const [actionDescription, setActionDescription] = useState("");

    const contactName = selectedContact ? `${selectedContact?.firstName} ${selectedContact?.lastName}` : null;
    const { agentId, npn, firstName, lastName, email, phone } = useUserProfile();
    const { statusOptions } = useContext(StageStatusContext);

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
    const GET_CAMPAIGN_URL = `${process.env.REACT_APP_COMMUNICATION_API}/CampaignLog`;

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
        Get: fetchCampaignDetailsById,
        loading: isFetchCampaignDetailsByIdLoading,
        error: fetchCampaignDetailsByIdError,
    } = useFetch(GET_CAMPAIGN_URL);

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

    const statusOptionsMap = useMemo(() => {
        return statusOptions.map((item) => ({
            value: item.statusId,
            label: item.label,
            color: item.color,
        }));
    }, [statusOptions]);

    const handleSummaryBarInfo = (result, label, total) => {
        const leadsList = result?.map((lead) => ({
            leadsId: lead?.leadsId,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            destination: campaignChannel === "Email" ? lead?.email || undefined : lead?.phone || undefined,
        }));
        setFilteredContactsList(leadsList);
        setFilteredCount(result ? result?.length : 0);
        setFilteredContentStatus(label);
        setFilteredEligibleCount(total);
    };

    const handleCampaignAction = (condition, payload) => {
        if (condition && campaignStatus === campaignStatuses.DRAFT) {
            setTimeout(() => {
                handleCreateOrUpdateCampaign(payload);
            }, 1000);
        }
    };

    useEffect(() => {
        handleCampaignAction(
            campaignActionType === "contacts filtered by…" && filteredContactsList?.length > 0 && filteredCount > 0,
            { campaign_ActionType: "contacts filtered by…" }
        );

        handleCampaignAction(
            campaignActionType === "all contacts" && allContactsList?.length > 0 && totalContactsCount > 0,
            { campaign_ActionType: "all contacts" }
        );

        handleCampaignAction(campaignActionType === "a contact" && selectedContact, {
            campaign_ActionType: "a contact",
        });

        handleCampaignAction(
            campaignActionType !== "contacts filtered by…" &&
                campaignActionType !== "a contact" &&
                campaignActionType !== "" &&
                allContactsList?.length > 0,
            {
                campaign_ActionType: campaignActionType,
            }
        );
    }, [filteredContactsList, campaignActionType, allContactsList, totalContactsCount, filteredCount, selectedContact]);

    const handleSelectedContact = (contact) => {
        setSelectedContact(contact);
        setCampaignActionType("a contact");
    };

    const { fetchTableDataWithoutFilters, fetchTableData } = useFetchCampaignLeads();

    const fetchAllListCount = useCallback(async () => {
        const response = await fetchTableDataWithoutFilters({
            searchString: null,
            sort: ["createDate:desc"],
            returnAll: true,
            searchId: contactSearchId,
            statusOptionsMap,
        });
        setTotalContactsCount(response?.total);
        setEligibleContactsLength(response?.eligibleContactsLength);
        const leadsList = response?.leadsList?.map((lead) => ({
            leadsId: lead?.leadsId,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            destination: campaignChannel === "Email" ? lead?.email || undefined : lead?.phone || undefined,
        }));
        setAllContactsList(leadsList);
    }, [fetchTableDataWithoutFilters, campaignChannel, contactSearchId, statusOptionsMap]);

    useEffect(() => {
        if (
            campaignActionType === "all contacts" ||
            (campaignActionType !== "contacts filtered by…" &&
                campaignActionType !== "a contact" &&
                campaignActionType !== "")
        ) {
            (async () => {
                await fetchAllListCount();
            })();
        }
    }, [fetchAllListCount, campaignActionType]);

    const reset = () => {
        sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
        setCampaignDescriptionType("");
        setCampaignActionType("");
        setTemplateId("");
        setTemplateImageUrl("");
        setTemplateDescription("");
        setTemplateDetails([]);
        setFilteredContactsList([]);
        setFilteredCount(null);
        setSelectedContact(null);
    };

    const handleTemplateData = (data) => {
        setTemplateDetails(data?.templateDetails);
        setTemplateId(data?.templateId);
        setContactSearchId(data?.id);
        setTemplateImageUrl(data?.templateImageUrl);
        setTemplateDescription(data?.templateDescription);
        setCampaignDescriptionType(data?.campaignDescription);
        const campaignActions = data?.campaignActions?.filter((action) => action?.actionType === "Basic");
        setCampaignActions(campaignActions);
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
    }, [fetchCampaignDetailsByEmail, fireEvent, showToast]);

    const getCampaignDetailsByText = useCallback(
        async (templateId) => {
            try {
                const resData = await fetchCampaignDetailsByText(null, false);

                if (resData?.length) {
                    setAllCampaignInvitationData(resData);
                    if (templateId) {
                        const templateData = resData?.find((item) => item?.templateId === templateId);
                        if (templateData) {
                            handleTemplateData(templateData);
                        }
                    }
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
        },
        [fetchCampaignDetailsByEmail, fireEvent, showToast]
    );

    const handleGetCampaignDetailsById = useCallback(
        async (campaignId) => {
            try {
                const resData = await fetchCampaignDetailsById(null, false, campaignId);
                if (resData) {
                    setCampaignId(campaignId);
                    setCampaignName(resData?.customCampaignDescription);
                    setCampaignStatus(resData?.campaignStatus);
                    setCampaignChannel(resData?.campaignChannel);
                    const templateId = resData?.requestPayload?.templateId || null;
                    if (resData?.campaignChannel === "Email") {
                        const emailCampaignsData = await getCampaignDetailsByEmail();
                        const templateData = emailCampaignsData?.find((item) => item?.templateId === templateId);
                        if (templateData) {
                            handleTemplateData(templateData);
                            if (
                                resData?.campaignSelectedAction === "contacts filtered by…" &&
                                resData?.customFilter &&
                                templateData?.id
                            ) {
                                const customFilterData = JSON.parse(JSON.parse(resData?.customFilter));
                                const { selectedFilterSections, filteredContentStatus } = customFilterData;
                                sessionStorage.setItem(
                                    "campaign_contactList_selectedFilterSections",
                                    JSON.stringify(selectedFilterSections)
                                );

                                const filterData = await fetchTableData({
                                    sort: ["createDate:desc"],
                                    searchString: undefined,
                                    selectedFilterSections: selectedFilterSections,
                                    isSilent: true,
                                    returnAll: true,
                                    searchId: templateData?.id,
                                    statusOptionsMap,
                                });

                                handleSummaryBarInfo(
                                    filterData?.tableData,
                                    filteredContentStatus,
                                    filterData?.filteredEligibleCount
                                );
                            } else {
                                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                            }
                            if (
                                resData?.campaignSelectedAction !== "a contact" &&
                                resData?.campaignSelectedAction !== "all contacts" &&
                                resData?.campaignSelectedAction !== "contacts filtered by…" &&
                                resData?.campaignSelectedAction !== ""
                            ) {
                                const actionData = templateData?.campaignActions?.find(
                                    (item) => item?.actionName === resData?.campaignSelectedAction
                                );
                                if (actionData) {
                                    setActionDescription(actionData?.actionDescription);
                                }
                            }
                        }
                    } else if (resData?.campaignChannel === "Sms") {
                        await getCampaignDetailsByText(templateId);
                    }
                    setCampaignActionType(resData?.campaignSelectedAction);
                    if (resData?.campaignSelectedAction === "a contact") {
                        setSelectedContact(resData?.requestPayload?.leads[0]);
                    }
                }
                return resData;
            } catch (error) {
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: "Failed to get campaign details.",
                    time: 5000,
                });
                console.error("Failed to get campaign details.", error);
            }
            return null;
        },
        [fetchCampaignDetailsById, fireEvent, showToast]
    );

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
            customCampaignDescription: campaignName,
            campaignChannel: "",
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

    const updateCampaignRequestPayload = ({ campaign_Status, template_Id, campaign_Channel, campaign_ActionType }) => {
        // Retrieve and parse the JSON string from session storage
        const selectedFilterSections = JSON.parse(
            sessionStorage.getItem("campaign_contactList_selectedFilterSections")
        );

        // Construct the customFilterData object
        const customFilterData = {
            selectedFilterSections: selectedFilterSections,
            filteredContentStatus: filteredContentStatus,
        };

        const payload = {
            id: campaignId,
            agentId: agentId,
            agentNpn: npn,
            campaignType: "Blast",
            campaignStatus: campaign_Status ? campaign_Status : campaignStatus,
            customCampaignDescription: campaignName,
            campaignChannel: campaign_Channel ? campaign_Channel : campaignChannel,
            campaignSelectedAction:
                campaign_ActionType === "empty" ? "" : campaign_ActionType ? campaign_ActionType : campaignActionType,
            customFilter:
                campaignActionType === "contacts filtered by…" &&
                filteredContactsList?.length > 0 &&
                selectedFilterSections?.length > 0
                    ? JSON.stringify(customFilterData)
                    : "",
            requestPayload: {
                agentId: agentId,
                agentNPN: npn,
                agentFirstName: firstName,
                agentLastName: lastName,
                agentEmail: email,
                agentPhone: phone,
                templateId: template_Id === "empty" ? "" : template_Id ? template_Id : templateId,
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

        if (payload?.campaignSelectedAction === "all contacts") {
            return {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: allContactsList,
                },
            };
        } else if (payload?.campaignSelectedAction === "contacts filtered by…") {
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
                                campaignChannel === "Email"
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
        async ({ campaign_Status, redirectTo, template_Id, campaign_Channel, campaign_ActionType, isUpdate =true }) => {
            try {
                let resData = null;
                if (isUpdate) {
                    resData = await updateCampaign(
                        updateCampaignRequestPayload({
                            campaign_Status,
                            template_Id,
                            campaign_Channel,
                            campaign_ActionType,
                        }),
                        false
                    );
                } else {
                    resData = await startCampaign(createCampaignRequestPayload(campaign_Status), false);
                }
                if (resData) {
                    fireEvent("Campaign Created/Updated", {
                        campaignName: campaignName,
                        campaignDescription: campaignDescriptionType,
                        scope:
                            campaignActionType === "contacts filtered by…"
                                ? "filter contacts"
                                : campaignActionType === "all contacts"
                                ? "all contacts"
                                : "search for a contact",
                    });
                    if (redirectTo) {
                        navigate(`${redirectTo}/${resData?.id}`);
                    }
                    if (isUpdate && resData?.campaignStatus === campaignStatuses.COMPLETED) {
                        setCampaignStatus(campaignStatuses.COMPLETED);
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
            startCampaign,
            fireEvent,
            showToast,
            campaignActionType,
            allContactsList,
            filteredContactsList,
            selectedContact,
            agentId,
            npn,
            campaignChannel,
            firstName,
            lastName,
            email,
            phone,
            agentAccountDetails,
            agentPurlURL,
            navigate,
        ]
    );

    return (
        <CampaignInvitationContext.Provider value={getContextValue()}>{children}</CampaignInvitationContext.Provider>
    );

    function getContextValue() {
        return {
            filteredContentStatus,
            filteredCount,
            totalContactsCount,
            reset,
            handleSummaryBarInfo,
            getCampaignDetailsByEmail,
            isFetchCampaignDetailsByEmailLoading,
            fetchCampaignDetailsByEmailError,
            getCampaignDetailsByText,
            isFetchCampaignDetailsByTextLoading,
            fetchCampaignDetailsByTextError,
            setSelectedContact,
            selectedContact,
            contactName,
            setCampaignActionType,
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
            eligibleContactsLength,
            filteredEligibleCount,
            allCampaignInvitationData,
            campaignStatuses,
            isCreateCampaignModalOpen,
            setIsCreateCampaignModalOpen,
            handleGetCampaignDetailsById,
            isFetchCampaignDetailsByIdLoading,
            campaignName,
            campaignStatus,
            campaignChannel,
            campaignDescriptionType,
            setCampaignName,
            setCampaignChannel,
            handleTemplateData,
            campaignActionType,
            setCampaignActionType,
            templateImageUrl,
            templateDescription,
            templateDetails,
            campaignId,
            contactSearchId,
            campaignActions,
            actionDescription,
            setActionDescription,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
