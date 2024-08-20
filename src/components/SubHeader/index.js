import React from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import styles from "./styles.module.scss";

const SubHeader = ({ title, showBackButton, customBackNav }) => {
    const handleBack = () => {
        if (customBackNav) {
            customBackNav();
        } else {
            window.history.back();
        }
    };

    return (
        <Box className={styles.subHeader}>
            {showBackButton && (
                <Box className={styles.backToContacts}>
                    <Button
                        icon={<img src={NewBackBtn} alt="Back" />}
                        label="Back"
                        onClick={handleBack}
                        type="tertiary"
                        className={styles.backButton}
                    />
                </Box>
            )}
            <Typography
                sx={{
                    color: "#052A63",
                    fontSize: "32px",
                    textAlign: "center",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

SubHeader.propTypes = {
    /** The title to be displayed in the center of the CampaignSubHeader */
    title: PropTypes.string.isRequired,
    /** Whether to show the back button */
    showBackButton: PropTypes.bool,
    /** Custom navigation function for the back button */
    customBackNav: PropTypes.func,
};

export default SubHeader;
