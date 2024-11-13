/* eslint-disable max-lines */
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

const HIDE_SHOPPERS_CAMPAIGNS = [];
export const CampaignInvitationContext = createContext();
const campaignsSortOrder = {
    PlanEnrollProfile: 1,
    UpdatePlanEnrollProfile: 2,
    SignSoa: 3,
    ThankClientHealth: 4,
    ThankClientLife: 5,
    ClientEmailOrCall: 6,
    HappyBirthday: 7,
};

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

    const [campaign, setCampaign] = useState({});
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
    const [contactSearchId, setContactSearchId] = useState(0);
    const [allCampaignActions, setAllCampaignActions] = useState([]);
    const [campaignActions, setCampaignActions] = useState([]);
    const [actionDescription, setActionDescription] = useState("");
    const [actionOrderedId, setActionOrderedId] = useState(0);
    const [isAdvancedMode, setAdvancedMode] = useState(false);

    const contactName = selectedContact ? `${selectedContact?.firstName} ${selectedContact?.lastName}` : null;
    const { agentId, npn, firstName, lastName, email, phone } = useUserProfile();
    const { statusOptions } = useContext(StageStatusContext);
    const navigate = useNavigate();
    const showToast = useToast();
    const { fireEvent } = useAnalytics();

    const campaignStatuses = {
        DRAFT: "Draft",
        SUBMITTED: "Submitted",
        COMPLETED: "Completed",
        ACTIVE: "Active",
        PAUSED: "Paused",
    };
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

    const { Get: fetchCampaignDetailsById, loading: isFetchCampaignDetailsByIdLoading } = useFetch(GET_CAMPAIGN_URL);

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

    const formattedPhoneNumber = agentAccountDetails?.agentVirtualPhoneNumber?.replace(/^\+1/, "");

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
        const filterCondition =
            (campaignActionType === "contacts filtered by…" || campaignActionType === "a contact when") &&
            filteredContactsList?.length >= 0 &&
            filteredCount >= 0;
        handleCampaignAction(filterCondition, { campaign_ActionType: campaignActionType });

        handleCampaignAction(
            campaignActionType === "all contacts" && allContactsList?.length > 0 && totalContactsCount > 0,
            { campaign_ActionType: "all contacts" },
        );

        handleCampaignAction(campaignActionType === "a contact" && selectedContact, {
            campaign_ActionType: "a contact",
        });

        handleCampaignAction(
            campaignActionType !== "contacts filtered by…" &&
                campaignActionType !== "a contact when" &&
                campaignActionType !== "a contact" &&
                campaignActionType !== "" &&
                allContactsList?.length > 0,
            {
                campaign_ActionType: campaignActionType,
            },
        );
    }, [filteredContactsList, campaignActionType, allContactsList, totalContactsCount, filteredCount, selectedContact]);

    const handleSelectedContact = (contact) => {
        setSelectedContact(contact);
        setCampaignActionType("a contact");
    };

    const handleAdvanceToggleMode = () => {
        setAdvancedMode(!isAdvancedMode);
        if (isAdvancedMode && campaignActionType === "a contact when") {
            resetSecond();
        }
    };

    const { fetchTableDataWithoutFilters, fetchTableData } = useFetchCampaignLeads();

    const fetchAllListCount = useCallback(async () => {
        const response = await fetchTableDataWithoutFilters({
            searchString: null,
            sort: ["createDate:desc"],
            returnAll: true,
            searchId: contactSearchId,
            statusOptionsMap,
            actionOrderedId,
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
    }, [fetchTableDataWithoutFilters, campaignChannel, contactSearchId, statusOptionsMap, actionOrderedId]);

    useEffect(() => {
        if (
            campaignActionType === "all contacts" ||
            (campaignActionType !== "contacts filtered by…" &&
                campaignActionType !== "a contact when" &&
                campaignActionType !== "a contact" &&
                campaignActionType !== "")
        ) {
            (async () => {
                await fetchAllListCount();
            })();
        }
    }, [fetchAllListCount, campaignActionType, actionOrderedId]);

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
        setActionOrderedId(0);
    };

    const resetSecond = () => {
        sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
        setFilteredContactsList([]);
        setFilteredCount(null);
        setSelectedContact(null);
        setFilteredContentStatus(null);
        setActionOrderedId(0);
        setCampaignActionType("");
    };

    const resetThird = () => {
        sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
        setFilteredContactsList([]);
        setFilteredCount(null);
        setSelectedContact(null);
        setFilteredContentStatus(null);
    };

    const handleTemplateData = (data, initial) => {
        setTemplateDetails(data?.templateDetails);
        setTemplateId(data?.templateId);
        setContactSearchId(data?.id);
        setTemplateImageUrl(data?.templateImageUrl);
        setTemplateDescription(data?.templateDescription);
        setCampaignDescriptionType(data?.campaignDescription);
        setAllCampaignActions(data?.campaignActions);

        const action = data?.campaignActions?.find(
            (item) => (item?.actionFilter || item?.actionDescription) && item?.actionOrder === 1,
        );
        if (initial) {
            if (action) {
                setCampaignActionType(action?.actionName);
                setActionDescription(action?.actionDescription);
                setActionOrderedId(action?.actionOrder);
            } else {
                setCampaignActionType("");
                setActionDescription("");
                setActionOrderedId(0);
            }
        }
    };

    useEffect(() => {
        if (!isAdvancedMode && allCampaignActions?.length && campaignChannel === "Email") {
            const basicCampaignActions = allCampaignActions?.filter((action) => action?.actionType === "Basic");
            setCampaignActions(basicCampaignActions);
        } else {
            setCampaignActions(allCampaignActions);
        }
    }, [isAdvancedMode, campaignChannel, allCampaignActions]);

    const getCampaignDetailsByEmail = useCallback(async () => {
        try {
            const resData = await fetchCampaignDetailsByEmail(null, false);

            if (resData?.length) {
                const filteredCampaigns = resData.filter(
                    (item) => !HIDE_SHOPPERS_CAMPAIGNS.includes(item?.campaignName),
                );
                const sortedCampaigns = filteredCampaigns.sort((a, b) => {
                    const orderA =
                        campaignsSortOrder[a.campaignName] !== undefined
                            ? campaignsSortOrder[a.campaignName]
                            : Number.MAX_SAFE_INTEGER;
                    const orderB =
                        campaignsSortOrder[b.campaignName] !== undefined
                            ? campaignsSortOrder[b.campaignName]
                            : Number.MAX_SAFE_INTEGER;
                    return orderA - orderB;
                });
                setAllCampaignInvitationData(sortedCampaigns);
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
                    const filteredCampaigns = resData.filter(
                        (item) => !HIDE_SHOPPERS_CAMPAIGNS.includes(item?.campaignName),
                    );
                    const sortedCampaigns = filteredCampaigns.sort((a, b) => {
                        const orderA =
                            campaignsSortOrder[a.campaignName] !== undefined
                                ? campaignsSortOrder[a.campaignName]
                                : Number.MAX_SAFE_INTEGER;
                        const orderB =
                            campaignsSortOrder[b.campaignName] !== undefined
                                ? campaignsSortOrder[b.campaignName]
                                : Number.MAX_SAFE_INTEGER;
                        return orderA - orderB;
                    });
                    setAllCampaignInvitationData(sortedCampaigns);
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
        [fetchCampaignDetailsByEmail, fireEvent, showToast],
    );

    const handleCreateCampaignFromContact = async ({
        campaignChannel,
        campaignTitle,
        customCampaign,
        actionType,
        lead,
    }) => {
        let payload = {};

        payload = {
            id: 0,
            agentId: agentId,
            agentNpn: npn,
            campaignType: "Individual",
            campaignStatus: campaignStatuses.DRAFT,
            customCampaignDescription: campaignTitle,
            campaignChannel: campaignChannel,
            campaignSelectedAction: actionType,
            requestPayload: {
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

        if (campaignChannel === "Email") {
            const emailCampaignsData = await getCampaignDetailsByEmail();
            const templateData = emailCampaignsData?.find((item) => item?.campaignName === customCampaign);

            payload = {
                ...payload,
                campaignId: templateData?.id,
                requestPayload: {
                    ...payload.requestPayload,
                    templateId: templateData?.templateId,
                    campaignId: templateData?.id,
                },
            };

            if (lead) {
                payload = {
                    ...payload,
                    requestPayload: {
                        ...payload.requestPayload,
                        leads: [
                            {
                                ...lead,
                            },
                        ],
                    },
                };
            }
            await handleCreateOrUpdateCampaign({
                redirectTo: "/marketing/campaign-details",
                payload: payload,
                isUpdate: false,
            });
        }

        if (campaignChannel === "Sms") {
            const textCampaignsData = await getCampaignDetailsByText();
            const templateData = textCampaignsData?.find((item) => item?.campaignName === customCampaign);

            payload = {
                ...payload,
                campaignId: templateData?.id,
                requestPayload: {
                    ...payload.requestPayload,
                    templateId: templateData?.templateId,
                    campaignId: templateData?.id,
                },
            };

            if (lead) {
                payload = {
                    ...payload,
                    requestPayload: {
                        ...payload.requestPayload,
                        leads: [
                            {
                                ...lead,
                            },
                        ],
                    },
                };
            }
            await handleCreateOrUpdateCampaign({
                redirectTo: "/marketing/campaign-details",
                payload: payload,
                isUpdate: false,
            });
        }
    };

    const handleGetCampaignDetailsById = useCallback(
        async (campaignId) => {
            reset();
            try {
                const resData = await fetchCampaignDetailsById(null, false, campaignId);
                if (resData) {
                    setCampaign(resData);
                    setCampaignId(campaignId);
                    setCampaignName(resData?.customCampaignDescription);
                    setCampaignStatus(resData?.campaignStatus);
                    setCampaignChannel(resData?.campaignChannel);
                    const templateId = resData?.requestPayload?.templateId || null;
                    if (resData?.campaignSelectedAction === "a contact when") {
                        setAdvancedMode(true);
                    }
                    if (resData?.campaignChannel === "Email") {
                        const emailCampaignsData = await getCampaignDetailsByEmail();
                        const templateData = emailCampaignsData?.find((item) => item?.templateId === templateId);
                        if (templateData) {
                            handleTemplateData(templateData);
                            if (
                                (resData?.campaignSelectedAction === "contacts filtered by…" ||
                                    resData?.campaignSelectedAction === "a contact when") &&
                                resData?.customFilter &&
                                templateData?.id
                            ) {
                                let customFilterData;
                                try {
                                    const customFilter = JSON.parse(resData?.customFilter);
                                    if (customFilter) {
                                        customFilterData = JSON.parse(customFilter);
                                    } else {
                                        customFilterData = {};
                                    }
                                } catch (error) {
                                    customFilterData = {};
                                }

                                if (customFilterData?.selectedFilterSections) {
                                    sessionStorage.setItem(
                                        "campaign_contactList_selectedFilterSections",
                                        JSON.stringify(customFilterData.selectedFilterSections),
                                    );
                                }
                                const filterData = await fetchTableData({
                                    sort: ["createDate:desc"],
                                    searchString: undefined,
                                    selectedFilterSections: customFilterData?.selectedFilterSections || [],
                                    isSilent: true,
                                    returnAll: true,
                                    searchId: templateData?.id,
                                    statusOptionsMap,
                                });
                                const filteredContentStatus = customFilterData?.filteredContentStatus || "";

                                handleSummaryBarInfo(
                                    filterData?.tableData,
                                    filteredContentStatus,
                                    filterData?.filteredEligibleCount,
                                );
                            } else {
                                sessionStorage.removeItem("campaign_contactList_selectedFilterSections");
                            }
                            if (
                                resData?.campaignSelectedAction !== "a contact" &&
                                resData?.campaignSelectedAction !== "all contacts" &&
                                resData?.campaignSelectedAction !== "contacts filtered by…" &&
                                resData?.campaignSelectedAction !== "a contact when" &&
                                resData?.campaignSelectedAction !== ""
                            ) {
                                const actionData = templateData?.campaignActions?.find(
                                    (item) => item?.actionName === resData?.campaignSelectedAction,
                                );
                                if (actionData) {
                                    setActionDescription(actionData?.actionDescription);
                                    setActionOrderedId(actionData?.actionOrder);
                                }
                            }
                        }
                    } else if (resData?.campaignChannel === "Sms") {
                        await getCampaignDetailsByText(templateId);
                    }
                    setCampaignActionType(resData?.campaignSelectedAction);
                    if (resData?.campaignSelectedAction === "a contact") {
                        const contact = {
                            leadsId: resData?.requestPayload?.leads[0]?.leadsId,
                            firstName: resData?.requestPayload?.leads[0]?.firstName,
                            lastName: resData?.requestPayload?.leads[0]?.lastName,
                            email:
                                resData?.campaignChannel === "Email"
                                    ? resData?.requestPayload?.leads[0]?.destination
                                    : undefined,
                            phone:
                                resData?.campaignChannel === "Sms"
                                    ? resData?.requestPayload?.leads[0]?.destination
                                    : undefined,
                        };
                        setSelectedContact(contact);
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
            }
            return null;
        },
        [fetchCampaignDetailsById, fireEvent, showToast],
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

    const updateCampaignRequestPayload = ({
        campaign_Status,
        template_Id,
        campaign_Channel,
        campaign_ActionType,
        selectedCampaignId,
        template_Description,
    }) => {
        // Retrieve and parse the JSON string from session storage
        const selectedFilterSections = JSON.parse(
            sessionStorage.getItem("campaign_contactList_selectedFilterSections"),
        );

        // Construct the customFilterData object
        const customFilterData = {
            selectedFilterSections: selectedFilterSections,
            filteredContentStatus: filteredContentStatus,
        };

        const channel = campaign_Channel ? campaign_Channel : campaignChannel;
        const actionType =
            campaign_ActionType === "empty" ? "" : campaign_ActionType ? campaign_ActionType : campaignActionType;

        const payload = {
            campaignId: selectedCampaignId === "empty" ? 0 : selectedCampaignId ? selectedCampaignId : contactSearchId,
            id: campaignId,
            agentId: agentId,
            agentNpn: npn,
            campaignType: actionType === "a contact when" ? "Event" : (channel === "Sms" || actionType === "a contact" ? "Individual" : "Blast"),
            campaignStatus: campaign_Status ? campaign_Status : campaignStatus,
            customCampaignDescription: campaignName,
            campaignChannel: channel,
            campaignSelectedAction:
                campaign_ActionType === "empty" ? "" : campaign_ActionType ? campaign_ActionType : campaignActionType,
            customFilter:
                (campaignActionType === "contacts filtered by…" || campaignActionType === "a contact when") &&
                selectedFilterSections?.length > 0
                    ? JSON.stringify(customFilterData)
                    : "",
            requestPayload: {
                agentId: agentId,
                agentNPN: npn,
                agentFirstName: firstName,
                agentLastName: lastName,
                agentEmail: email,
                agentPhone: formattedPhoneNumber,
                templateId: template_Id === "empty" ? "" : template_Id || templateId,
                templateDescription:
                    template_Description === "empty" ? "" : template_Description || templateDescription,
                custom1: `${process.env.REACT_APP_MEDICARE_ENROLL}/quick-profile?purl=${agentPurlURL?.agentPurlCode}`,
                custom2: "Integrity",
                custom3: formattedPhoneNumber,
                custom4: `${process.env.REACT_APP_MEDICARE_ENROLL}/?purl=${agentPurlURL?.agentPurlCode}`,
                custom5: agentAccountDetails?.caLicense,
                custom6: agentAccountDetails?.profileImageUrl,
                custom7: `${firstName.charAt(0)} ${lastName.charAt(0)}`,
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
        } else if (
            payload?.campaignSelectedAction === "a contact when" &&
            selectedFilterSections?.length > 0 &&
            filteredContactsList?.length > 0
        ) {
            const eventData = selectedFilterSections[0];
            let id = eventData?.selectedFilterOption;
            const triggerType = eventData?.sectionId;
            if (triggerType === "stage") {
                id = statusOptionsMap?.find((item) => item.value === id)?.label;
            }

            return {
                ...payload,
                campaignType: "Event",
                eventTrigger: {
                    triggerType: triggerType === "stage" ? "Lead" : "Tag",
                    when: triggerType === "stage" ? "Status" : id,
                    becomes: triggerType === "stage" ? id : undefined,
                },
                requestPayload: {
                    ...payload.requestPayload,
                    leads: [],
                },
            };
        } else if (selectedContact?.leadsId && payload?.campaignSelectedAction === "a contact") {
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
        } else if (payload?.campaignSelectedAction !== "" && allContactsList?.length > 0) {
            return {
                ...payload,
                requestPayload: {
                    ...payload.requestPayload,
                    leads: allContactsList,
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
        async ({
            campaign_Status,
            redirectTo,
            template_Id,
            campaign_Channel,
            campaign_ActionType,
            payload,
            isUpdate = true,
            selectedCampaignId,
            template_Description,
        }) => {
            try {
                let resData = null;
                if (isUpdate) {
                    resData = await updateCampaign(
                        updateCampaignRequestPayload({
                            campaign_Status,
                            template_Id,
                            campaign_Channel,
                            campaign_ActionType,
                            selectedCampaignId,
                            template_Description,
                        }),
                        false,
                    );
                } else {
                    const requestPayload = payload ?? createCampaignRequestPayload(campaign_Status);
                    resData = await startCampaign(requestPayload, false);
                }
                if (resData) {
                    setCampaign(resData);
                    if (campaign_Status === campaignStatuses.SUBMITTED) {
                        const fireEventPayload = {
                            campaignName: campaignName,
                            campaignDescription: campaignDescriptionType,
                            mode: resData?.campaignType === "Event" ? "advanced" : "basic",
                            scope:
                                campaignActionType === "contacts filtered by…"
                                    ? "filter contacts"
                                    : campaignActionType === "all contacts"
                                      ? "all contacts"
                                      : campaignActionType === "a contact"
                                        ? "a contact"
                                        : campaignActionType === "a contact when"
                                          ? "a contact when"
                                          : campaignActionType,
                        };
                        fireEvent("Campaign Started", fireEventPayload);
                    }
                    if (redirectTo) {
                        navigate(`${redirectTo}/${resData?.id}`);
                    }
                    if (isUpdate) {
                        setCampaignStatus(resData.campaignStatus);
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
        ],
    );

    return (
        <CampaignInvitationContext.Provider value={getContextValue()}>{children}</CampaignInvitationContext.Provider>
    );

    function getContextValue() {
        return {
            actionDescription,
            allCampaignInvitationData,
            allContactsList,
            campaign,
            campaignActions,
            campaignActionType,
            campaignChannel,
            campaignDescriptionType,
            campaignId,
            campaignName,
            campaignStatus,
            campaignStatuses,
            contactName,
            contactSearchId,
            currentPage,
            eligibleContactsLength,
            fetchCampaignDetailsByEmailError,
            fetchCampaignDetailsByTextError,
            filteredContactsList,
            filteredContentStatus,
            filteredCount,
            filteredEligibleCount,
            getAgentAccountInformation,
            getCampaignDetailsByEmail,
            getCampaignDetailsByText,
            handleCreateCampaignFromContact,
            handleCreateOrUpdateCampaign,
            handleGetCampaignDetailsById,
            handleSelectedContact,
            handleSummaryBarInfo,
            handleTemplateData,
            isCreateCampaignModalOpen,
            isFetchCampaignDetailsByEmailLoading,
            isFetchCampaignDetailsByIdLoading,
            isFetchCampaignDetailsByTextLoading,
            isStartCampaignLoading,
            isUpdateCampaignLoading,
            reset,
            selectedContact,
            setActionDescription,
            setCampaignActionType,
            setCampaignChannel,
            setCampaignName,
            setCurrentPage,
            setFilteredContactsList,
            setFilteredCount,
            setFilteredContentStatus,
            setIsCreateCampaignModalOpen,
            setSelectedContact,
            startCampaignError,
            templateDescription,
            templateDetails,
            templateImageUrl,
            totalContactsCount,
            updateCampaignError,
            resetSecond,
            actionOrderedId,
            setActionOrderedId,
            isAdvancedMode,
            setAdvancedMode,
            handleAdvanceToggleMode,
            resetThird,
        };
    }
};

CampaignInvitationProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
