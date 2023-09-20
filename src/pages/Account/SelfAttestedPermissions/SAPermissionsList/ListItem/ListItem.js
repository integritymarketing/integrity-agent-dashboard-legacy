import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { dateFormatter } from "utils/dateFormatter";
import { DeleteButton } from "../../DeleteButton";

import styles from "./styles.module.scss";

function ListItem({ item }) {
  return (
    <Grid
      className={styles.container}
      display="flex"
      justifyContent="space-between"
    >
      <Grid>
        <Box className={styles.section}>
          <Box className={styles.label}>Carrier:</Box>
          <Box>{item.carrier}</Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label}>Product:</Box>
          <Box className={styles.pill}>{item.product}</Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label}>State:</Box>
          <Box>{item.state}</Box>
        </Box>
        <Box className={styles.section}>
          <Box className={styles.label} display="inline">
            Added:
          </Box>
          <Box display="inline">
            {dateFormatter(item.createDate, "M-DD-YY")}
          </Box>
        </Box>
      </Grid>
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Box>
            <Box className={styles.label} display="inline">
              Year:
            </Box>
            <Box display="inline">{item.planYear}</Box>
          </Box>
          <Box>
            <Box className={styles.label} display="inline">
              ID:
            </Box>
            <Box display="inline"> {item.awn}</Box>
          </Box>
        </Box>
        <Box>
          <DeleteButton />
        </Box>
      </Grid>
    </Grid>
  );
}

ListItem.propTypes = {
  item: PropTypes.object,
};

export default ListItem;
