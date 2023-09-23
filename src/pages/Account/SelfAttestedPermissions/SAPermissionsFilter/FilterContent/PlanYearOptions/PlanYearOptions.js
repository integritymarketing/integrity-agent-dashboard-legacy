import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Check from "components/icons/check-blue";

import styles from "./styles.module.scss";

function PlanYearOption({ filterOptions, onUpdateFilters, filters }) {
  const planYears = filterOptions.planYears;

  return (
    <>
      <Box className={styles.sectionTitle}>Plan Year</Box>
      <Box className={styles.planYears}>
        {planYears.map((year, index) => (
          <Box
            key={index}
            className={styles.planYear}
            onClick={() => onUpdateFilters(year, "years")}
          >
            <Box>{year}</Box>
            {filters["years"].includes(year) && <Check />}
          </Box>
        ))}
      </Box>
    </>
  );
}

PlanYearOption.propTypes = {
  filterOptions: PropTypes.object,
  onUpdateFilterss: PropTypes.func,
  filters: PropTypes.object,
};

export default PlanYearOption;
