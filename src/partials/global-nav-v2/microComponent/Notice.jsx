import { Typography } from "@mui/material";
import { CustomModal } from "components/MuiComponents";
import PropTypes from "prop-types";

export default function NoticeModal({ open = false, handleClose = () => {} }) {
    const handleAccountPageNavigation = () => {
        window.location.href = `${import.meta.env.VITE_AUTH_PAW_REDIRECT_URI}/agent-profile#Preferences`;
    };

    return (
        <CustomModal
            title="Set Your Availability Preferences"
            maxWidth="xs"
            subtitle={
                <Typography variant="body1" color="#052a63">
                    To receive Realtime calls, please verify that your life or health lead sources are enabled and that
                    you have at least one active campaign. Availability preferences can be adjusted in your account
                    settings.
                </Typography>
            }
            showCloseButton
            open={open}
            handleClose={handleClose}
            saveLabel="View Account Settings"
            handleSave={handleAccountPageNavigation}
            footer
            shouldShowCancelButton={false}
        ></CustomModal>
    );
}

NoticeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
