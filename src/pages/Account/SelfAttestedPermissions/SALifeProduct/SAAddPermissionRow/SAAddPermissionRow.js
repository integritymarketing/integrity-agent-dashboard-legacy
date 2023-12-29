import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "components/icons/add";

import styles from "./styles.module.scss";

import { useSAPermissionsContext } from "../../providers/SAPermissionProvider";
import { useSALifeProductContext } from "../providers/SALifeProductProvider";

function SAAddPermissionRow() {
    const { tableData } = useSALifeProductContext();
    const { isAddingLife, handleAddLife } = useSAPermissionsContext();
    const numOfPermissions = tableData?.length ?? 0;
    const shouldShow = !isAddingLife && numOfPermissions === 0;

    if (!shouldShow) {
        return <></>;
    }

    return (
        <Grid className={styles.customRow} container justifyContent="center" alignItems="center">
            <Grid display="flex" alignItems="center" onClick={handleAddLife} className={styles.link} gap={1}>
                <AddIcon color="#4178FF" />
                <Box>Add Permission</Box>
            </Grid>
        </Grid>
    );
}

export default SAAddPermissionRow;
