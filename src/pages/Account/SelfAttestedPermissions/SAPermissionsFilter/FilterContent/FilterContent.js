import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Check from "components/icons/check-blue";
import FilterButtons from "./FilterButtons/FilterButtons";

import styles from "./styles.module.scss";

const defaultFilters = {
  carriers: [],
  states: [],
  years: [],
  products: [],
};

function FilterContent({ open, submit, filterOptions, filters }) {
  const [localFilters, setFilters] = useState(defaultFilters);

  const planYears = filterOptions.planYears;
  const carriers = filterOptions.carriers;
  const states = filterOptions.states;
  const products = filterOptions.products;

  const onUpdateFilters = (value, field) => {
    const updatedFilters = { ...localFilters };
    updatedFilters[field] = updatedFilters[field] || [];
    if (updatedFilters[field].includes(value)) {
      updatedFilters[field] = updatedFilters[field].filter(
        (item) => item !== value
      );
    } else {
      updatedFilters[field].push(value);
    }
    setFilters(updatedFilters);
  };

  const onResetHandle = () => {
    setFilters(defaultFilters);
    submit(defaultFilters);
  };

  const onApplyHanle = () => {
    submit(localFilters);
  };

  if (!open) return <></>;

  return (
    <Box className={styles.filterContent}>
      <Box className={styles.contentInner}>
        <Box className={styles.filterTitle}>Filter By</Box>
        <Box className={styles.section}>
          <Box className={styles.sectionTitle}>Plan Year</Box>
          <Box className={styles.planYears}>
            {planYears.map((year, index) => (
              <Box
                key={index}
                className={styles.planYear}
                onClick={() => onUpdateFilters(year, "years")}
              >
                <Box>{year}</Box>
                {localFilters["years"].includes(year) && <Check />}
              </Box>
            ))}
          </Box>
        </Box>
        <FilterButtons reset={onResetHandle} apply={onApplyHanle} />
      </Box>
    </Box>
  );
}

FilterContent.propTypes = {
  submit: PropTypes.func,
  filterOptions: PropTypes.object,
  open: PropTypes.bool,
  filters: PropTypes.object,
};

export default FilterContent;
