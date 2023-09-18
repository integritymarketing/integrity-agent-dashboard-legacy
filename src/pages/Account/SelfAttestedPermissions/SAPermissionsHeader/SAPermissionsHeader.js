import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import Arrow from "components/icons/down";
import AddIcon from "components/icons/add";
import Heading2 from "packages/Heading2";
import Info from "components/icons/info-blue";

import styles from "./styles.module.scss";

const useStyles = makeStyles(() => ({
  link: {
    color: "#4178FF",
    cursor: "pointer",
  },
  inactiveLink: {
    cursor: "not-allowed",
    pointerEvents: "none",
    color: "#B3C9FF",
  },
  icon: {
    padding: "10px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f1faff",
      borderRadius: "40px",
    },
  },
  iconReverse: {
    transform: "rotate(180deg)",
  },
  count: {
    color: "#717171",
    fontSize: "24px",
  },
}));

function SAPermissionsHeader({
  handleAddNew,
  setIsModalOpen,
  setIsCollapsed,
  isCollapsed,
  numOfPermissions = 0,
  isAdding,
}) {
  const classess = useStyles();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid display="flex" alignItems="center">
        <Box
          className={`${classess.icon} ${isCollapsed && classess.iconReverse}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Arrow color="#4178FF" />
        </Box>
        <Heading2 className={styles.heading} text="Self-Attested Permissions" />
        <Box className={classess.count}>({numOfPermissions})</Box>
        <Box className={classess.icon} onClick={setIsModalOpen}>
          <Info color="#4178FF" />
        </Box>
      </Grid>
      <Grid
        display="flex"
        alignItems="center"
        onClick={handleAddNew}
        className={isAdding ? classess.inactiveLink : classess.link}
        gap={1}
      >
        <Box>Add New</Box>
        <AddIcon color="#4178FF" />
      </Grid>
    </Grid>
  );
}

SAPermissionsHeader.propTypes = {
  isCollapsed: PropTypes.bool,
  handleAddNew: PropTypes.func,
  setIsModalOpen: PropTypes.func,
  setIsCollapsed: PropTypes.func,
  numOfPermissions: PropTypes.number,
  isAdding: PropTypes.bool,
};

export default SAPermissionsHeader;
