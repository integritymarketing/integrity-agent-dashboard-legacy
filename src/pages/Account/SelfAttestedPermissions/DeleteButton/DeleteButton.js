import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TrashBinIcon from "components/icons/trashbin";

import styles from "./styles.module.scss";

function DeleteButton() {
  return (
    <Grid
      display="flex"
      alignItems="center"
      className={styles.link}
      gap={1}
    >
      <Box>Delete</Box>
      <TrashBinIcon color="#4178ff" />
    </Grid>
  );
}

DeleteButton.propTypes = {};

export default DeleteButton;
