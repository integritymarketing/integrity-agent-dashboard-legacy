import { useState } from "react";

import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import MissingActiveSellingPermissions from "components/MissingActiveSellingPermissions";
import Modal from "components/Modal";
import InfoBlue from "components/icons/version-2/InfoBlue";

import styles from "./styles.module.scss";

function ActivePermissionsHeader() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.heading}>Active Selling Permissions</Box>
                <Box className={styles.icon} onClick={setModalOpen}>
                    <InfoBlue />
                </Box>
            </Box>
            <Divider />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Active Selling Permissions" hideFooter>
                <MissingActiveSellingPermissions isModal={true} />
            </Modal>
        </>
    );
}

export default ActivePermissionsHeader;
