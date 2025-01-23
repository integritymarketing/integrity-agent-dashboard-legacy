import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import AddIcon from "components/icons/add";

import { useAccountProductsContext } from "pages/Account/providers/AccountProductsProvider";

import styles from "./styles.module.scss";

import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

function SAPermissionsHeader() {
    const { isAddingHealth, isAddingLife, handleAddHealth, handleAddLife } = useSAPermissionsContext();
    const { layout } = useAccountProductsContext();
    const shouldDeactivate = isAddingHealth || isAddingLife;

    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.heading}>Self-Attested Permissions</Box>
                <Box
                    display="flex"
                    alignItems="center"
                    onClick={layout === "HEALTH" ? handleAddHealth : handleAddLife}
                    className={shouldDeactivate ? styles.inactiveLink : styles.link}
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
