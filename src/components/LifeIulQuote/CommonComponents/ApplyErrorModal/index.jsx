import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContinueIcon from "components/icons/Continue";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { CustomModal } from "components/MuiComponents";

export const ApplyErrorModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    const handleContactSupportNavigation = () => {
        navigate("/help");
    };
    return (
        <CustomModal
            title="Full IUL Apply Error"
            open={open}
            handleClose={onClose}
            showCloseButton
            maxWidth="xs"
            disableContentBackground
            shouldShowCancelButton={false}
            footer
            handleSave={handleContactSupportNavigation}
            saveLabel="Contact Support"
            footerActionIcon={<ContinueIcon />}
        >
            <Box className={styles.modalSection}>
                <Typography variant="body1" color="#434A51">
                    There was an error processing your request. Please contact support.
                </Typography>
            </Box>
        </CustomModal>
    );
};

ApplyErrorModal.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};