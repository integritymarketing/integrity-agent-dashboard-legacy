import React from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { CustomModal } from "components/MuiComponents";
import SendIcon from "@mui/icons-material/Send";
import styles from "./styles.module.scss";

const SendCampaignModal = ({ isModalOpen, setIsModalOpen, onSend, actionButtonName = "Send" }) => {
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSendCampaign = () => {
        onSend && onSend();
        setIsModalOpen(false);
    };

    return (
        <CustomModal
            title="Send Campaign"
            open={isModalOpen}
            handleClose={handleCloseModal}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            footer
            handleSave={handleSendCampaign}
            shouldShowCancelButton={true}
            saveLabel={actionButtonName}
            footerActionIcon={<SendIcon alt="Send icon" />}
        >
            <Box className={styles.modalContent}>
                <Typography variant="body1">
                    Are you sure you want to send this campaign? Sent messages cannot be unsent.
                </Typography>
            </Box>
        </CustomModal>
    );
};

SendCampaignModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired, // Controls the modal visibility
    setIsModalOpen: PropTypes.func.isRequired, // Function to close the modal
    onSend: PropTypes.func.isRequired, // Function to handle send action
    actionButtonName: PropTypes.string, // Text for the action button
};

export default SendCampaignModal;
