import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import styles from "./ContactBodyContainer.module.scss";

export const ContactBodyContainer = ({ children }) => {
    return <Box className={styles.ContactDetailsContainer}>{children}</Box>;
};

ContactBodyContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
