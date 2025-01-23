import { useState } from "react";

import { Box } from "@mui/material";

import PropTypes from "prop-types";

import styles from "./styles.module.scss";

const InforBanner = ({ title, description, PopupModal, showModal }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Box className={styles.bannerContainer} onClick={() => setOpen(true)}>
                <Box className={styles.nonRTS_Banner}>
                    <Box className={styles.title}>{title}</Box>
                    <Box className={styles.content}>{description}</Box>
                </Box>
            </Box>
            {showModal && PopupModal && <PopupModal modalOpen={open} handleClose={() => setOpen(false)} />}
        </>
    );
};

InforBanner.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    PopupModal: PropTypes.element,
    showModal: PropTypes.bool,
};

InforBanner.defaultProps = {
    title: "Carrier Appointment Information Pending",
    showModal: false,
    PopupModal: undefined,
    description:
        "Active selling permission data is currently unavailable for your account. This section will be updated once your carrier appointment information is in our files. Please contact your marketer if you have any questionss",
};

export default InforBanner;
