import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import Modal from '../../Modal';
import SendIcon from '@mui/icons-material/Send';
import styles from './styles.module.scss';

const SendCampaignModal = ({
                               isModalOpen,
                               setIsModalOpen,
                               onSend,
                               actionButtonName = "Send",
                               cancelButtonName = "Cancel",
                               hideFooter = false,
                           }) => {

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSendCampaign = () => {
        onSend && onSend();
        setIsModalOpen(false);
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            title="Send Campaign"
            onSave={handleSendCampaign}
            actionButtonName={actionButtonName}
            endIcon={<SendIcon alt="Send icon" />}
            onCancel={handleCloseModal}
            cancelButtonName={cancelButtonName}
            hideFooter={hideFooter}
        >
            <Box className={styles.modalContent}>
                <Typography variant="body1">
                    Are you sure you want to send this campaign? Sent messages cannot be unsent.
                </Typography>
            </Box>
        </Modal>
    );
};

SendCampaignModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired, // Controls the modal visibility
    setIsModalOpen: PropTypes.func.isRequired, // Function to close the modal
    onSend: PropTypes.func.isRequired, // Function to handle send action
    actionButtonName: PropTypes.string, // Text for the action button
    cancelButtonName: PropTypes.string, // Text for the cancel button
    hideFooter: PropTypes.bool, // If true, footer buttons will be hidden
};

export default SendCampaignModal;
