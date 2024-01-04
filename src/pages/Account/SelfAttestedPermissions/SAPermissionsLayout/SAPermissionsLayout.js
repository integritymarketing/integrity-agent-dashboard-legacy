import { useState } from "react";

import Box from "@mui/material/Box";

import InfoBlue from "components/icons/version-2/InfoBlue";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import styles from "./styles.module.scss";

import HealthInfoModal from "../SAPermissionModal/HealthInfoModal";
import LifeInfoModal from "../SAPermissionModal/LifeInfoModal";
import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

function SAPermissionsLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLifeModalOpen, setIsLifeModalOpen] = useState(false);
    const { layout, setLayout } = useAccountProductsContext();
    const { resetAdding } = useSAPermissionsContext();

    const onLayoutChangeHandle = (newLayout) => {
        resetAdding();
        setLayout(newLayout);
    };

    return (
        <Box className={styles.layoutContainer}>
            <Box
                className={`${styles.selection} ${layout === LIFE && styles.activeLayout}`}
                onClick={() => onLayoutChangeHandle(LIFE)}
            >
                <Box>Life</Box>
                {layout === LIFE && (
                    <Box className={styles.icon} onClick={() => setIsLifeModalOpen(true)}>
                        <InfoBlue />
                    </Box>
                )}
            </Box>
            <Box
                className={`${styles.selection} ${layout === HEALTH && styles.activeLayout}`}
                onClick={() => onLayoutChangeHandle(HEALTH)}
            >
                <Box>Health</Box>
                {layout === HEALTH && (
                    <Box className={styles.icon} onClick={() => setIsModalOpen(true)}>
                        <InfoBlue />
                    </Box>
                )}
            </Box>
            <HealthInfoModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <LifeInfoModal isModalOpen={isLifeModalOpen} setIsModalOpen={setIsLifeModalOpen} />
        </Box>
    );
}

export default SAPermissionsLayout;
