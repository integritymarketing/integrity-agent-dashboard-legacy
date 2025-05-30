import { Box, Typography, Button } from "@mui/material";
import NewBackBtn from "images/new-back-btn.svg";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

export const IulFilterHeader = ({ title, onClick }) => {
    return (
        <Box className={styles.quoteFilterHeader}>
            <Box className={styles.backButtonContainer}>
                <Button startIcon={<img src={NewBackBtn} alt="Back" />} label="Back" onClick={onClick} variant="text"
                color="primary"
                 />
            </Box>
            <Typography variant="h3" color="#052A63">
                {title}
            </Typography>
        </Box>
    );
};

IulFilterHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
