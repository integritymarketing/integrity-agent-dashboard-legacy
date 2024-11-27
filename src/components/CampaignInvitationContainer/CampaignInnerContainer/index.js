import { useEffect, useState, useMemo } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import EmailContent from "../EmailContent";
import styles from "./styles.module.scss";
import EmailPreview from "../EmailPreview";
import TextInputContent from "../TextInputContent";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import CampaignFlowContainer from "../CampaignFlowCard";
import ArrowForwardCircle from "../../../images/Campaigns/arrow-forward-circle.svg";
import AdvancedModeToggle from "../AdvancedModeToggle";
import SendCampaignModal from "../SendCampaignModal/SendCampaignModal";
import TemplateDescriptionCard from "../TemplateDescriptionCard";
import ActionPopoverContainer from "components/ClientConnectMarketing/ActionPopover";
import { ActionsSend, ActionsPause, ActionsStart } from "@integritymarketing/icons";
import { useMarketing } from "providers/Marketing";

const STATUS_COLORS = {
    Draft: { bgColor: "#DDDDDD", color: "#434A51" },
    Active: { bgColor: "#009E15", color: "#FFFFFF" },
    Paused: { bgColor: "#DDDDDD", color: "#434A51" },
    Completed: { bgColor: "#49648B", color: "#FFFFFF" },
};

const CampaignInnerContainer = () => {
    const {
        campaign,
        campaignChannel,
        campaignDescriptionType,
        selectedContact,
        filteredContactsList,
        allContactsList,
        campaignActionType,
        getAgentAccountInformation,
        isStartCampaignLoading,
        isUpdateCampaignLoading,
        campaignStatuses,
        campaignName,
        campaignStatus,
        templateDescription,
        handleGetCampaignDetailsById,
        filteredContentStatus,
        isAdvancedMode,
    } = useCampaignInvitation();

    const { handleAllCampaignActions } = useMarketing();

    const selectedFilters = JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections"));

    const [showPreview, setShowPreview] = useState(false);
    const [isSendCampaignModalOpen, setIsSendCampaignModalOpen] = useState(false);
    const [isSendingCampaign, setIsSendingCampaign] = useState(false);

    useEffect(() => {
        getAgentAccountInformation();
    }, []);

    useEffect(() => {
        if (campaignName?.includes("Get Sync") && campaignActionType === "a contact") {
            setShowPreview(true);
        }
        if (campaignActionType === "") {
            setShowPreview(false);
        }
    }, [campaignName, campaignActionType]);

    const readOnly = useMemo(() => campaignStatus !== campaignStatuses.DRAFT, [campaignStatus, campaignStatuses.DRAFT]);

    const advanceMode = useMemo(
        () => isAdvancedMode && campaignActionType === "a contact when",
        [isAdvancedMode, campaignActionType]
    );

    const allSelected = useMemo(() => {
        return (
            !isStartCampaignLoading &&
            Boolean(campaignDescriptionType) &&
            Boolean(campaignChannel) &&
            Boolean(campaignActionType) &&
            ((campaignActionType === "all contacts" && allContactsList?.length !== 0) ||
                ((campaignActionType === "contacts filtered by…" || campaignActionType === "a contact when") &&
                    selectedFilters?.length !== 0 &&
                    filteredContentStatus) ||
                (campaignActionType === "a contact" && selectedContact) ||
                (campaignActionType !== "" && allContactsList?.length !== 0))
        );
    }, [
        isStartCampaignLoading,
        campaignDescriptionType,
        campaignChannel,
        campaignActionType,
        allContactsList,
        selectedFilters,
        filteredContentStatus,
        selectedContact,
    ]);

    const handlePreviewClick = () => {
        setShowPreview(true);
    };

    const buttonStyles = {
        backgroundColor: STATUS_COLORS[campaignStatus]?.bgColor,
        color: STATUS_COLORS[campaignStatus]?.color,
        borderRadius: "4px",
        boxShadow: "none",
        cursor: "auto",
        fontSize: "13px",
        fontWeight: "400",
        "&:hover": {
            backgroundColor: STATUS_COLORS[campaignStatus]?.bgColor,
        },
    };

    const showPreviewButton = useMemo(() => !readOnly && !showPreview && allSelected, [readOnly, showPreview, allSelected]);

    const saveButtonDisabled = useMemo(() => {
        return (
            isStartCampaignLoading ||
            isUpdateCampaignLoading ||
            (campaignActionType === "contacts filtered by…" &&
                (filteredContactsList?.length === 0 || !filteredContentStatus)) ||
            (campaignActionType === "a contact when" && !filteredContentStatus) ||
            !allSelected
        );
    }, [
        isStartCampaignLoading,
        isUpdateCampaignLoading,
        campaignActionType,
        filteredContactsList,
        filteredContentStatus,
        allSelected,
    ]);

    const showCampaignButton = useMemo(
        () => (!readOnly && showPreview && allSelected) || (readOnly && campaignStatus !== campaignStatuses.COMPLETED),
        [readOnly, showPreview, allSelected]
    );

    const buttonName = useMemo(() => {
        if (campaignStatus === campaignStatuses.DRAFT) {
            return advanceMode ? "Start" : "Send";
        } else if (campaignStatus === campaignStatuses.ACTIVE) {
            return "Pause";
        } else if (campaignStatus === campaignStatuses.PAUSED) {
            return "Resume";
        }
        return "";
    }, [campaignStatus, advanceMode]);

    const handleActionButton = async () => {
        setIsSendingCampaign(true);
        const createPayload = (overrides) => ({
            ...campaign,
            ...overrides,
        });

        const handleCustomFilter = (payload) => {
            if (
                (payload?.campaignSelectedAction === "contacts filtered by…" ||
                    payload?.campaignSelectedAction === "a contact when") &&
                payload?.customFilter !== ""
            ) {
                const data = JSON.parse(JSON.parse(payload?.customFilter));
                payload.customFilter = data ? JSON.stringify(data) : "";
            }
        };

        let payload;
        let method;

        switch (buttonName) {
            case "Send":
                payload = createPayload({ campaignStatus: "Submitted" });
                handleCustomFilter(payload);
                method = "put";
                break;
            case "Start":
                payload = createPayload({ campaignStatus: "Submitted", campaignType: "Event" });
                handleCustomFilter(payload);
                method = "put";
                break;
            case "Pause":
                payload = createPayload({ campaignStatus: "Paused" });
                handleCustomFilter(payload);
                method = "put";
                break;
            case "Resume":
                payload = createPayload({ campaignStatus: "Active" });
                handleCustomFilter(payload);
                method = "put";
                break;
            default:
                setIsSendingCampaign(false);
                return;
        }

        await handleAllCampaignActions({
            payload,
            method,
            refresh: handleGetCampaignDetailsById,
            campaignDescription: campaignDescriptionType,
        });

        setIsSendingCampaign(false);
    };

    const saveIcon = useMemo(() => {
        switch (buttonName) {
            case "Send":
                return <ActionsSend color="#ffffff" />;
            case "Pause":
                return <ActionsPause color="#ffffff" />;
            case "Start":
                return <ActionsStart color="#ffffff" />;
            case "Resume":
                return <ActionsStart color="#ffffff" />;
            default:
                return null;
        }
    }, [buttonName]);

    const isValidStatus = useMemo(() => {
        return ["Draft", "Active", "Paused", "Completed"].includes(campaignStatus);
    }, [campaignStatus]);

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Box className={styles.campaignTitle}>
                    <Typography
                        sx={{
                            color: "#052A63",
                            fontSize: "24px",
                            textAlign: "center",
                            lineHeight: "32px",
                        }}
                    >
                        {campaignName}
                    </Typography>
                    {campaign && (
                        <ActionPopoverContainer
                            buttonDisable={saveButtonDisabled}
                            campaign={campaign}
                            refresh={handleGetCampaignDetailsById}
                            advanceMode={advanceMode}
                            campaignDescription={campaignDescriptionType}
                            page="campaign_details"
                            iconDisable={!isValidStatus}
                        />
                    )}
                </Box>

                <Box gap={2} className={styles.statusIcons}>
                    {(isStartCampaignLoading || isUpdateCampaignLoading) && (
                        <Button
                            variant="outlined"
                            startIcon={<CircularProgress size={20} thickness={4} className={styles.progressIcon} />}
                            sx={{
                                color: "#49648B",
                                borderColor: "#49648B",
                                textTransform: "none",
                                borderRadius: "4px",
                            }}
                        >
                            Saving
                        </Button>
                    )}

                    {campaignStatus && (
                        <Button variant="contained" sx={buttonStyles} disableRipple={true} disableElevation={true}>
                            {campaignStatus}
                        </Button>
                    )}
                </Box>
            </Box>

            <Box className={styles.content}>
                <CampaignFlowContainer showPreview={showPreview} allSelected={allSelected} readOnly={readOnly} />
                {showPreviewButton && (
                    <Box className={styles.previewCampaignButton}>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            endIcon={<img src={ArrowForwardCircle} alt="Arrow forward" />}
                            onClick={handlePreviewClick}
                        >
                            Preview Campaign
                        </Button>
                    </Box>
                )}
                {((showPreview && !readOnly && allSelected) || readOnly) && (
                    <>
                        <Grid container className={styles.detailsContainer}>
                            {templateDescription && <TemplateDescriptionCard description={templateDescription} />}
                            <Grid container>
                                {campaignChannel === "Sms" && <TextInputContent />}
                                {campaignChannel === "Email" && (
                                    <>
                                        <EmailContent />
                                        <EmailPreview />
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </>
                )}

                {isValidStatus && showCampaignButton && (
                    <Box className={styles.startCampaignButton}>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            endIcon={isSendingCampaign ? <CircularProgress size={24} /> : saveIcon}
                            onClick={() => {
                                setIsSendCampaignModalOpen(true);
                            }}
                            disabled={saveButtonDisabled}
                        >
                            {isSendingCampaign ? "Sending ..." : `${buttonName} Campaign`}
                        </Button>
                        <SendCampaignModal
                            isModalOpen={isSendCampaignModalOpen}
                            setIsModalOpen={setIsSendCampaignModalOpen}
                            buttonName={buttonName}
                            saveIcon={saveIcon}
                            onSend={handleActionButton}
                        />
                    </Box>
                )}
            </Box>

            {!readOnly && campaignChannel === "Email" && (
                <Box className={styles.advancedModeToggle}>
                    <AdvancedModeToggle />
                </Box>
            )}
        </Box>
    );
};

export default CampaignInnerContainer;