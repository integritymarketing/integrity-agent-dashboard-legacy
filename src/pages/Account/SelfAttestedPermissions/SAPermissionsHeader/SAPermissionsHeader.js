import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import AddIcon from "components/icons/add";
import Heading2 from "packages/Heading2";

import styles from "./styles.module.scss";

const useStyles = makeStyles(() => ({
  link: {
    color: "#4178FF",
  },
}));

function SAPermissionsHeader({
  handleAddNew,
  setIsModalOpen,
  setIsCollapsed,
  isCollapsed,
}) {
  const classess = useStyles();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid display="flex" alignItems="center">
        {!isCollapsed && <div onClick={() => setIsCollapsed(true)}>Down</div>}
        {isCollapsed && <div onClick={() => setIsCollapsed(false)}>Up</div>}
        <Heading2 className={styles.heading} text="Self-Attested Permissions" />
        <div onClick={setIsModalOpen}>opem</div>
      </Grid>
      <Grid display="flex" gap={1} alignItems="center" onClick={handleAddNew}>
        <Typography className={classess.link}>Add New</Typography>
        <AddIcon color="#4178FF" />
      </Grid>
    </Grid>
  );
}

export default SAPermissionsHeader;
