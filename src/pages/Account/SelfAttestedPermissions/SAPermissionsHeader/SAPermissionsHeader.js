import { useState } from "react";

import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import AddIcon from "components/icons/add";

import styles from "./styles.module.scss";

import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

function SAPermissionsHeader() {
    const { isAddingHealth, handleAddHealth } = useSAPermissionsContext();

    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.heading}>Self-Attested Permissions</Box>
                <Box
                    display="flex"
                    alignItems="center"
                    onClick={handleAddHealth}
                    className={isAddingHealth ? styles.inactiveLink : styles.link}
                    gap={1}
                >
                    <Box>Add New</Box>
                    <AddIcon color="#4178FF" />
                </Box>
            </Box>
            <Divider />
        </>
    );
}

export default SAPermissionsHeader;
