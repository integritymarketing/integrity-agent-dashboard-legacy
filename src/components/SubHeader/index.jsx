import PropTypes from "prop-types";
import { Typography, Box, Button } from "@mui/material";
import NewBackBtn from "../../images/new-back-btn.svg";
import styles from "./styles.module.scss";

const SubHeader = ({
    title,
    showBackButton,
    customBackNav,
    customBackButtonLabel,
    showActionButton,
    actionButtonText,
    onClickActionButton,
    actionButtonIcon,
}) => {
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
                        label={customBackButtonLabel || "Back"}
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

            {showActionButton && (
                <Box className={styles.actionButton}>
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        endIcon={actionButtonIcon}
                        onClick={onClickActionButton}
                    >
                        {actionButtonText}
                    </Button>
                </Box>
            )}
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

    /** Custom label for the back button */
    customBackButtonLabel: PropTypes.string,

    /** Whether to show the action button */
    showActionButton: PropTypes.bool,

    /** Text to be displayed on the action button */
    actionButtonText: PropTypes.string,

    /** Function to be called when the action button is clicked */
    onClickActionButton: PropTypes.func,

    /** Icon to be displayed on the action button */
    actionButtonIcon: PropTypes.node,
};

export default SubHeader;
