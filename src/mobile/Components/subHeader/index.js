import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

const SubHeaderMobile = ({ title, actionTitle, ActionIcon, callBack }) => {
    return (
        <Box className={styles.header}>
            <Box className={styles.title}>{title}</Box>
            {actionTitle ? (
                <Box onClick={callBack} className={styles.actionTitle}>
                    {actionTitle}{" "}
                    <Box className={styles.actionIcon}>
                        <ActionIcon />
                    </Box>
                </Box>
            ) : (
                <Box></Box>
            )}
        </Box>
    );
};

SubHeaderMobile.propTypes = {
    title: PropTypes.string.isRequired,
    actionTitle: PropTypes.string,
    ActionIcon: PropTypes.elementType.isRequired,
    callBack: PropTypes.func.isRequired,
};

export default SubHeaderMobile;
