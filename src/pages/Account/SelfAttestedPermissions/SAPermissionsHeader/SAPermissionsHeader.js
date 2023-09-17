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
        <Box
          className={`${classess.icon} ${isCollapsed && classess.iconReverse}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Arrow color="#4178FF" />
        </Box>
        <Heading2 className={styles.heading} text="Self-Attested Permissions" />
        <Box className={classess.icon} onClick={setIsModalOpen}>
          <Info color="#4178FF" />
        </Box>
      </Grid>
      <Grid
        display="flex"
        alignItems="center"
        onClick={handleAddNew}
        className={classess.link}
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
};

export default SAPermissionsHeader;
