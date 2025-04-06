import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import PropTypes from "prop-types";

const ProductOption = ({ label, icon, onClick }) => {
    return (
        <Box className={styles.plan} onClick={onClick}>
            <Box className={styles.icon}>{icon}</Box>
            <Box className={styles.title}>{label}</Box>
        </Box>
    );
};

ProductOption.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ProductOption;
