import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";

import AddIcon from "components/icons/add";

const useStyles = makeStyles(() => ({
  link: {
    color: "#4178FF",
    cursor: "pointer",
  },
  customRow: {
    backgroundColor: "#FFFFFF",
    padding: "15px",
    borderRadius: "8px"
  },
}));

function SAAddPermissionRow({ handleAddNew, numOfPermissions = 0, isAdding }) {
  const classess = useStyles();
  const shouldShow = !isAdding && numOfPermissions === 0;

  if (!shouldShow) return <></>;

  return (
    <Grid
      className={classess.customRow}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        display="flex"
        alignItems="center"
        onClick={handleAddNew}
        className={classess.link}
        gap={1}
      >
        <AddIcon color="#4178FF" />
        <Box>Add Permission</Box>
      </Grid>
    </Grid>
  );
}

SAAddPermissionRow.propTypes = {
  handleAddNew: PropTypes.func,
  numOfPermissions: PropTypes.number,
  isAdding: PropTypes.bool,
};

export default SAAddPermissionRow;
