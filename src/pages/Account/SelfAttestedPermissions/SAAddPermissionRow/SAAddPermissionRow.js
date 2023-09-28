import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "components/icons/add";
import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

import styles from "./styles.module.scss";

function SAAddPermissionRow() {
  const { isAdding, handleAddNew, tableData } = useSAPermissionsContext();
  const numOfPermissions = tableData.length;
  const shouldShow = !isAdding && numOfPermissions === 0;

  if (!shouldShow) return <></>;

  return (
    <Grid
      className={styles.customRow}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        display="flex"
        alignItems="center"
        onClick={handleAddNew}
        className={styles.link}
        gap={1}
      >
        <AddIcon color="#4178FF" />
        <Box>Add Permission</Box>
      </Grid>
    </Grid>
  );
}

export default SAAddPermissionRow;
