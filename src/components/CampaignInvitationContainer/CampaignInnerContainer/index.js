import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const CampaignInnerContainer = () => {
    const {
        campaign,
        campaignChannel,
        campaignDescriptionType,
        handleCreateOrUpdateCampaign,
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
    } = useCampaignInvitation();

    const readOnly = campaignStatus === campaignStatuses.COMPLETED;
    const selectedFilters = JSON.parse(sessionStorage.getItem("campaign_contactList_selectedFilterSections"));

    const [showPreview, setShowPreview] = useState(false);
    const [isSendCampaignModalOpen, setIsSendCampaignModalOpen] = useState(false);

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

    const allSelected =
        !isStartCampaignLoading &&
        Boolean(campaignDescriptionType) &&
        Boolean(campaignChannel) &&
        Boolean(campaignActionType) &&
        ((campaignActionType === "all contacts" && allContactsList?.length !== 0) ||
            (campaignActionType === "contacts filtered by…" &&
                filteredContactsList?.length !== 0 &&
                selectedFilters?.length !== 0 &&
                filteredContentStatus) ||
            (campaignActionType === "a contact" && selectedContact) ||
            (campaignActionType !== "" && allContactsList?.length !== 0));

    const handlePreviewClick = () => {
        setShowPreview(true);
    };

    const buttonStyles = {
        backgroundColor: readOnly ? "#49648B" : "#DDDDDD",
        color: readOnly ? "#FFF" : "#434A51",
        borderRadius: "4px",
        boxShadow: "none",
        cursor: "auto",
        fontSize: "13px",
        fontWeight: "400",
        "&:hover": {
            backgroundColor: readOnly ? "#49648B" : "#DDDDDD",
        },
    };

    const showPreviewButton = !readOnly && !showPreview && allSelected;

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
                    {campaign && <ActionPopoverContainer campaign={campaign} refresh={handleGetCampaignDetailsById} />}
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
                <CampaignFlowContainer showPreview={showPreview} allSelected={allSelected} />
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

                {!readOnly && showPreview && allSelected && (
                    <Box className={styles.startCampaignButton}>
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            endIcon={<img src={ArrowForwardCircle} alt="Arrow forward" />}
                            onClick={() => {
                                setIsSendCampaignModalOpen(true);
                            }}
                            disabled={isStartCampaignLoading || isUpdateCampaignLoading}
                        >
                            Send Campaign
                        </Button>
                        <SendCampaignModal
                            isModalOpen={isSendCampaignModalOpen}
                            setIsModalOpen={setIsSendCampaignModalOpen}
                            onSend={() => {
                                handleCreateOrUpdateCampaign({
                                    campaign_Status: campaignStatuses.SUBMITTED,
                                });
                            }}
                        />
                    </Box>
                )}
            </Box>

            {false && !readOnly && (
                <Box className={styles.advancedModeToggle}>
                    <AdvancedModeToggle />
                </Box>
            )}
        </Box>
    );
};

export default CampaignInnerContainer;
