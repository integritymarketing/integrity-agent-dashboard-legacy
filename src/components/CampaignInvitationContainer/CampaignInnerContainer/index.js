import { useEffect } from "react";
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
        isStartCampaignLoading,
    } = useCampaignInvitation();

    useEffect(() => {
        getAgentAccountInformation();
    }, [getAgentAccountInformation]);

    const disabled =
        isStartCampaignLoading ||
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
                            endIcon={isStartCampaignLoading ? null : <ArrowForwardWithCircle />}
                            label={isStartCampaignLoading ? "Loading..." : "Start Campaign"}
                            disabled={disabled}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CampaignInnerContainer;
