import React from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Modal from "components/Modal";

import styles from "./InfoModal.module.scss";
import { Typography } from "@mui/material";

/**
 * Displays a modal with information about various tasks and leads.
 *
 * @param {object} props Component props.
 * @param {boolean} props.open Controls the visibility of the modal.
 * @param {function} props.onClose Function to call when the modal is closed.
 */
export const InfoModal = ({ open, onClose, isMobile }) => {
  const TitleData =
  "View your policies by status. Policy status is imported directly from carriers and the availability of status and other policy information may vary by carrier. For the most complete and up-to-date policy information, submit your applications through Contact Management Quote & eApp. Please visit our Learning Center to view the list of carriers whose policies are available in Policy Snapshot or find out more about Policy Management.";
    return (
        <Modal maxWidth={isMobile ? "xs" : "sm"} open={open} onClose={onClose} hideFooter title="Policy Snapshot">

            <Box className={styles.connectModalBody}>
              <Typography variant="body1" color="#434A51">
               {TitleData}
              </Typography>
            </Box>
        </Modal>
    );
};

InfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InfoModal;
