import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Arrow from "components/icons/down";
import AddIcon from "components/icons/add";
import Heading2 from "packages/Heading2";
import Info from "components/icons/info-blue";
import { useWindowSize } from "hooks/useWindowSize";
import { SAPermissionsFilter } from "../SAPermissionsFilter";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

function SAPermissionsHeader() {
  const {
    setIsCollapsed,
    handleAddNew,
    isCollapsed,
    isAdding,
    filteredData,
    setIsModalOpen,
  } = useSAPermissionsContext();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= 784;
  const numOfPermissions = filteredData.length;

  return (
    <Grid className={styles.container}>
      <Grid className={styles.leftContainer}>
        <Box
          className={`${styles.icon} ${isCollapsed && styles.iconReverse}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Arrow color="#4178FF" />
        </Box>
        <Heading2 className={styles.heading} text="Self-Attested Permissions" />
        <Box className={styles.count}>({numOfPermissions})</Box>
        <Box className={styles.icon} onClick={setIsModalOpen}>
          <Info color="#4178FF" />
        </Box>
      </Grid>
      <Box className={styles.rightContainer}>
        <Grid
          display="flex"
          alignItems="center"
          onClick={handleAddNew}
          className={isAdding ? styles.inactiveLink : styles.link}
          gap={1}
        >
          <Box>Add New</Box>
          <AddIcon color="#4178FF" />
        </Grid>
        {isMobile && <SAPermissionsFilter />}
      </Box>
    </Grid>
  );
}

export default SAPermissionsHeader;
