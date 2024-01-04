import { useState } from "react";

import Box from "@mui/material/Box";

import MissingActiveSellingPermissions from "components/MissingActiveSellingPermissions";
import Modal from "components/Modal";
import InfoBlue from "components/icons/version-2/InfoBlue";

import { HEALTH, LIFE, useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import styles from "./styles.module.scss";

import LifeInfoModal from "../ActivePermissionModal/LifeInfoModal";

function SAPermissionsLayout() {
    const [isLifeModalOpen, setIsLifeModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { layout, setLayout } = useAccountProductsContext();

    const onLayoutChangeHandle = (newLayout) => {
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
                    <Box className={styles.icon} onClick={() => setModalOpen(true)}>
                        <InfoBlue />
                    </Box>
                )}
            </Box>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Active Selling Permissions" hideFooter>
                <MissingActiveSellingPermissions isModal={true} />
            </Modal>
            <LifeInfoModal isModalOpen={isLifeModalOpen} setIsModalOpen={setIsLifeModalOpen} />
        </Box>
    );
}

export default SAPermissionsLayout;
