import { useState } from "react";

import Box from "@mui/material/Box";

import InfoBlue from "components/icons/version-2/InfoBlue";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import styles from "./styles.module.scss";

import HealthInfoModal from "../SAPermissionModal/HealthInfoModal";

function SAPermissionsLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { layout, setLayout } = useAccountProductsContext();

    return (
        <Box className={styles.layoutContainer}>
            <Box
                className={`${styles.selection} ${layout === LIFE && styles.activeLayout}`}
                onClick={() => setLayout(HEALTH)}
            >
                <Box>Final Expense</Box>
            </Box>
            <Box
                className={`${styles.selection} ${layout === HEALTH && styles.activeLayout}`}
                onClick={() => setLayout(HEALTH)}
            >
                <Box>Health</Box>
                <Box className={styles.icon} onClick={() => setIsModalOpen(true)}>
                    <InfoBlue />
                </Box>
            </Box>
            <HealthInfoModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Box>
    );
}

export default SAPermissionsLayout;
