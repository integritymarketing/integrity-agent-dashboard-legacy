import React, { useMemo } from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Modal from "components/Modal";

import styles from "./InfoModal.module.scss";

/**
 * Displays a modal with information about various tasks and leads.
 *
 * @param {object} props Component props.
 * @param {boolean} props.open Controls the visibility of the modal.
 * @param {function} props.onClose Function to call when the modal is closed.
 */
export const InfoModal = ({ open, onClose, isMobile }) => {
    const contentSections = useMemo(
        () => [
            {
                title: "PlanEnroll Leads",
                content:
                    "See and contact new leads generated for you on PlanEnroll.com. For more information about PlanEnroll.com leads, please read our PlanEnroll Leads Guide.",
            },
            {
                title: "Health SoAs",
                content:
                    "Track the 48-hour cooling off period as required by CMS. Tracked SOAs will appear here as soon as they’re signed by your clients, and you’ll be able to complete the SOAs as soon as the cooling off period has expired. For more information about SOA Tracking, including disabling SOA Tracking, please read our SOA Guide.",
            },
            {
                title: "Reminders",
                content:
                    "View upcoming and overdue reminders across your list of Contacts. You can edit, delete, and complete Reminders here, as well as jump to Contact records for more details. For more information about Reminders, please read our Contact Management Guide.",
            },
            {
                title: "Unlinked Calls",
                content:
                    "Find call recordings made to your Integrity Agent Phone Number that haven’t been linked to a Contact yet. You can link calls to an existing Contact or create and link to a new Contact. For more information, please read our Call Recording Guide.",
            },
            // Add additional sections here as needed
        ],
        []
    );

    return (
        <Modal maxWidth={isMobile ? "xs" : "sm"} open={open} onClose={onClose} hideFooter title="Task List">
            <div className={styles.title}>View time-sensitive items and quickly take action to serve your clients.</div>
            <Box className={styles.connectModalBody}>
                {contentSections.map((section, index) => (
                    <Box key={index} className={styles.contentContainer}>
                        <div className={styles.subHeading}>{section.title}</div>
                        <div className={styles.content}>{section.content}</div>
                    </Box>
                ))}
            </Box>
        </Modal>
    );
};

InfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InfoModal;
