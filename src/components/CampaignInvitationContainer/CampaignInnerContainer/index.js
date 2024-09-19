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
import CustomPopover from "../../CustomPopOver";
import { CampaignActionsEllipsis } from "@integritymarketing/icons";

const campaignOperations = [
    { optionText: "Rename", value: "rename" },
    { optionText: "Start", value: "start" },
    { optionText: "Copy", value: "copy" },
    { optionText: "Delete", value: "delete" },
];

const CampaignInnerContainer = () => {
    const {
        invitationSendType,
        campaignDescription,
        handleCreateOrUpdateCampaign,
        selectedContact,
        filteredContactsList,
        allContactsList,
        filteredContactsType,
        getAgentAccountInformation,
        isStartCampaignLoading,
        isUpdateCampaignLoading,
        campaignInvitationData,
        createdNewCampaign,
        campaignStatuses,
    } = useCampaignInvitation();

    const readOnly = createdNewCampaign?.campaignStatus === campaignStatuses.COMPLETED;

    const [showPreview, setShowPreview] = useState(false);
    const [isSendCampaignModalOpen, setIsSendCampaignModalOpen] = useState(false);
    const [campaignOperationsAnchorEl, setCampaignOperationsAnchorEl] = useState(null);

    useEffect(() => {
        getAgentAccountInformation();
    }, []);

    useEffect(() => {
        if (filteredContactsType === "") {
            setShowPreview(false);
        }
    }, [filteredContactsType]);

    const contactsTypeNotSelected =
        isStartCampaignLoading ||
        isUpdateCampaignLoading ||
        filteredContactsType === "" ||
        (filteredContactsType === "all contacts" && allContactsList?.length === 0) ||
        (filteredContactsType === "contacts filtered by .." && filteredContactsList?.length === 0) ||
        (filteredContactsType === "a contact" && !selectedContact);

    const handlePreviewClick = () => {
        setShowPreview(true);
    };

    const buttonStyles = {
        borderColor: readOnly ? "#49648B" : "#e0e0e0",
        backgroundColor: readOnly ? "#49648B" : "#e0e0e0",
        color: readOnly ? "#FFF" : "#000",
        textTransform: "none",
        borderRadius: "4px",
        boxShadow: "none",
        cursor: "none",
        "&:hover": {
            backgroundColor: readOnly ? "#49648B" : "#e0e0e0",
        },
    };

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
                        {campaignDescription}
                    </Typography>
                    <Box
                        onClick={() => {
                            setCampaignOperationsAnchorEl(true);
                        }}
                    >
                        <CampaignActionsEllipsis color="#4178FF" size="md" />
                    </Box>
                    <CustomPopover
                        options={campaignOperations}
                        anchorEl={campaignOperationsAnchorEl}
                        handleAction={() => {
                            setCampaignOperationsAnchorEl(null);
                        }}
                        handleClose={() => setCampaignOperationsAnchorEl(null)}
                    />
                </Box>

                <Box display="flex" gap={2}>
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

                    {createdNewCampaign && (
                        <Button variant="contained" sx={buttonStyles} disableRipple={true} disableElevation={true}>
                            {createdNewCampaign?.campaignStatus}
                        </Button>
                    )}
                </Box>
            </Box>

            <Box className={styles.content}>
                <CampaignFlowContainer showPreview={showPreview} contactsTypeNotSelected={contactsTypeNotSelected} />

                {showPreview && (
                    <Grid container className={styles.detailsContainer}>
                        {invitationSendType === "Sms" && <TextInputContent />}
                        {invitationSendType === "Email" && (
                            <>
                                <EmailContent />
                                <EmailPreview />
                            </>
                        )}
                    </Grid>
                )}

                {!showPreview && campaignInvitationData && !contactsTypeNotSelected && (
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

                {!readOnly && showPreview && campaignInvitationData && !contactsTypeNotSelected && (
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
                                handleCreateOrUpdateCampaign(campaignStatuses.SUBMITTED);
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

CampaignInnerContainer.propTypes = {
    campaignDescription: PropTypes.string, // Description of the campaign
};

CampaignInnerContainer.defaultProps = {
    campaignDescription: "Campaign", // Default campaign description
};

export default CampaignInnerContainer;
