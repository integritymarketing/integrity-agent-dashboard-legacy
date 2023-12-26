import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function ActivePermissionsHeader() {
    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.heading}>Active Selling Permissions</Box>
            </Box>
            <Divider />
        </>
    );
}

export default ActivePermissionsHeader;
