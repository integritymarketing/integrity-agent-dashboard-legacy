import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { CustomModal } from "components/MuiComponents";
import styles from "./styles.module.scss";

const SendCampaignModal = ({ isModalOpen, setIsModalOpen, onSend, buttonName, saveIcon }) => {
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSendCampaign = () => {
        onSend && onSend();
        setIsModalOpen(false);
    };

    const otherActionName = useMemo(() => {
        switch (buttonName) {
            case "Pause":
                return "resume";
            case "Start":
                return "pause";
            case "Resume":
                return "pause";
            default:
                return buttonName;
        }
    }, [buttonName]);

    return (
        <CustomModal
            title={`${buttonName} Campaign`}
            open={isModalOpen}
            handleClose={handleCloseModal}
            showCloseButton
            maxWidth="sm"
            disableContentBackground
            footer
            handleSave={handleSendCampaign}
            shouldShowCancelButton={true}
            saveLabel={`${buttonName}`}
            footerActionIcon={saveIcon}
        >
            <Box className={styles.modalContent}>
                <Typography variant="body1">
                    Are you sure you want to {buttonName?.toLowerCase()} this campaign? Sent messages cannot be unsent.
                    {buttonName !== "Send" && `You can ${otherActionName}  this campaign later.`}
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
    buttonName: PropTypes.string, // Text for the modal title,
    saveIcon: PropTypes.element, // Icon for the action button
};

export default SendCampaignModal;
