import React from "react";

import { Box } from "@mui/material";

import PropTypes from "prop-types";

import styles from "./MissingActiveSellingPermissions.module.scss";

const MissingActiveSellingPermissions = ({ isModal }) => {
    return (
        <>
            {isModal && <div className={styles.modalHeading}>Missing Active Selling Permissions?</div>}
            <Box className={`${styles.container} ${isModal ? styles.modalContainer : styles.helpContainer}`}>
                {!isModal && <div className={styles.heading}>Missing Active Selling Permissions?</div>}
                <div className={styles.text}>
                    Not all of your contracted carriers may appear in your Active Selling Permissions list.
                </div>
                <div className={styles.text}>
                    This list will contain only those carriers which are available for enrollment in the platform, and
                    that you have contracted through an Integrity Partner Agency. Carriers which are not contracted
                    through an Integrity Partner, or available for enrollment, will not be displayed in your Active
                    Selling Permissions list.
                </div>
                <div className={styles.text}>
                    If you are still concerned of a missing selling permission, please reach out to your Upline for
                    assistance prior to submitting a ticket with Integrity Support. To ensure efficient resolution of
                    this concern, please include the following information in your request to support:
                </div>
                <ul className={styles.list}>
                    <li>NPN</li>
                    <li>Integrity FMO Upline</li>
                    <li>List of carriers, states, or products that are missing</li>
                </ul>
            </Box>
        </>
    );
};

MissingActiveSellingPermissions.propTypes = {
    isModal: PropTypes.bool.isRequired,
};

export default MissingActiveSellingPermissions;
