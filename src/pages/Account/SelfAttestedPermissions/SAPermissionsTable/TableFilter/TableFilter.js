import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Filter from "packages/Filter/Filter";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";

import styles from "./styles.module.scss";

function TableFilter() {
  return (
    <Box className={styles.customFilter}>
      <Filter
        Icon={FilterIcon}
        ActiveIcon={ActiveFilter}
        heading=""
        onToggle={() => {}}
      />
    </Box>
  );
}

export default TableFilter;
