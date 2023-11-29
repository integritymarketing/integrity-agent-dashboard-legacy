import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

import { HEALTH, LIFE, useActivePermissionsContext } from "../providers/ActivePermissionsProvider";

function ActivePermissionsLayout() {
    const { layout, setLayout } = useActivePermissionsContext();

    return (
        <Box className={styles.layoutContainer}>
            <Box
                className={`${styles.selection} ${layout === LIFE && styles.activeLayout}`}
                onClick={() => setLayout(HEALTH)}
            >
                Life
            </Box>
            <Box
                className={`${styles.selection} ${layout === HEALTH && styles.activeLayout}`}
                onClick={() => setLayout(HEALTH)}
            >
                Health
            </Box>
        </Box>
    );
}

export default ActivePermissionsLayout;
