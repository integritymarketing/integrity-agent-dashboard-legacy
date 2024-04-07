/* eslint-disable max-lines-per-function */
import { useState } from "react";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import ArrowForwardWithCirlce from "./Icons/ArrowForwardWithCirlce";

import Modal from "components/Modal";

import styles from "./index.module.scss";

export const SingleSignOnInitialModal = ({ isOpen, onClose, onRetry }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            onCancel={onClose}
            title="Single Sign On"
            size="wide"
            contentStyle={{ borderRadius: "8px" }}
            onSave={onRetry}
            actionButtonName="Retry"
            endIcon={<ArrowForwardWithCirlce />}
        >
            <Box className={styles.content}>
                We were unable to complete your request. Please wait a moment and try again. If this problem persists
                please <span className={styles.contentBlue}>contact user support.</span>
            </Box>
        </Modal>
    );
};

SingleSignOnInitialModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    carrierInfo: PropTypes.object,
    resourceUrl: PropTypes.string,
    onApply: PropTypes.func,
    fetchPlans: PropTypes.func,
};

SingleSignOnInitialModal.defaultProps = {
    isOpen: false,
};

export default SingleSignOnInitialModal;
