import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const CampaignSubHeader = ({ title, onBackClick }) => {
    // Using useCallback to memoize the onBackClick handler to avoid unnecessary re-renders
    const handleBackClick = useCallback(() => {
        onBackClick();
    }, [onBackClick]);
    const { invitationName } = useCampaignInvitation();

    return (
        <Box
            sx={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid #CCCCCC",
                backgroundColor: "#FFFFFF",
                position: "relative",
            }}
        >
            <Box className={styles.backToContacts}>
                <Button
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label="Back"
                    onClick={handleBackClick}
                    type="tertiary"
                    className={styles.backButton}
                />
            </Box>
            <Typography
                sx={{
                    color: "#052A63",
                    fontSize: "32px",
                    textAlign: "center",
                    lineHeight: "40px",
                    flexGrow: 1,
                }}
            >
                {`Invitation To ${invitationName}`}
            </Typography>
        </Box>
    );
};

CampaignSubHeader.propTypes = {
    /** The title to be displayed in the center of the CampaignSubHeader */
    title: PropTypes.string.isRequired,
    /** Function to be called when the back button is clicked */
    onBackClick: PropTypes.func.isRequired,
};

export default CampaignSubHeader;
