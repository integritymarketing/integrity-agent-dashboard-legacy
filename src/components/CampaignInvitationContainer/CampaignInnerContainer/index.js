import React, { useEffect } from "react";
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
 
const CampaignInnerContainer = () => {
    const {
        invitationSendType,
        handleCancel,
        campaignDescription,
        handleStartCampaign,
        selectedContact,
        filteredContactsList,
        allContactsList,
        filteredContactsType,
        getAgentAccountInformation,
    } = useCampaignInvitation();
 
    useEffect(() => {
        getAgentAccountInformation();
    }, [getAgentAccountInformation]);
 
    const disabled =
        (filteredContactsType === "all contacts" && allContactsList?.length === 0) ||
        (filteredContactsType === "contacts filtered by .." && filteredContactsList?.length === 0) ||
        (filteredContactsType === "a contact" && !selectedContact);
 
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
                    {campaignDescription}
                </Typography>
            </Box>
            <Box className={styles.content}>
                <InvitationBar />
                <InvitationCountBar />
 
                <Grid container className={styles.detailsContainer}>
                    {invitationSendType === "Text" && <TextInputContent />}
                    {invitationSendType === "Email" && (
                        <>
                            <EmailContent />
                            <EmailPreview />
                        </>
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
                            onClick={handleStartCampaign}
                            endIcon={<ArrowForwardWithCircle />}
                            label="Start Campaign"
                            disabled={disabled}
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
 