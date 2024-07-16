import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Grid } from "@mui/material";
import InvitationCountBar from "../InvitationCountBar";
import InvitationBar from "../InvitationBar";
import EmailContent from "../EmailContent";
import styles from "./styles.module.scss";
import EmailPreview from "../EmailPreview";
import { Button } from "components/ui/Button";
import RoundButton from "components/RoundButton";
import { ArrowForwardWithCircle } from "components/ContactDetailsContainer/OverviewContainer/Icons";
import TextInputContent from "../TextInputContent";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const CampaignInnerContainer = ({ title, onBackClick }) => {
    const { invitationSendType, handleSendInvitation, handleCancel, invitationName } = useCampaignInvitation();

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Typography
                    sx={{
                        color: "#052A63",
                        fontSize: "24px",
                        textAlign: "center",
                        lineHeight: "32px",
                    }}
                >
                    {`Invitation to ${invitationName} Profile Sync`}
                </Typography>
            </Box>
            <Box className={styles.content}>
                <InvitationBar />
                <InvitationCountBar />

                <Grid container className={styles.detailsContainer}>
                    {invitationSendType === "text" && (
                        <Box className={styles.textInputContainer}>
                            <TextInputContent />
                        </Box>
                    )}
                    {invitationSendType === "email" && (
                        <Box className={styles.emailContainer}>
                            <EmailContent />
                            <EmailPreview />
                        </Box>
                    )}
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box className={styles.backToContacts}>
                        <Button label="Cancel" onClick={handleCancel} type="tertiary" className={styles.backButton} />
                    </Box>
                    <Box className={styles.backToContacts}>
                        <RoundButton
                            onClick={handleSendInvitation}
                            endIcon={<ArrowForwardWithCircle />}
                            label="Start Campaign"
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

CampaignInnerContainer.propTypes = {
    /** The title to be displayed in the center of the CampaignInnerContainer */
    title: PropTypes.string.isRequired,
    /** Function to be called when the back button is clicked */
    onBackClick: PropTypes.func.isRequired,
};

export default CampaignInnerContainer;
