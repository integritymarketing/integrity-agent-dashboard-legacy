import { Box } from "@mui/material";
import styles from "./styles.module.scss";

const ProductOption = ({ label, icon, onClick }) => {
    return (
        <Box className={styles.plan} onClick={onClick}>
            <Box className={styles.icon}>{icon}</Box>
            <Box className={styles.title}>{label}</Box>
        </Box>
    );
};

export default ProductOption;
