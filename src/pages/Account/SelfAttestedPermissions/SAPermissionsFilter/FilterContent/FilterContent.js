import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import FilterButtons from "./FilterButtons/FilterButtons";
import { FilterTabs } from "./FilterTabs";
import { PlanYearOptions } from "./PlanYearOptions";

import styles from "./styles.module.scss";

const getEmptyObject = () => ({
  carriers: [],
  states: [],
  years: [],
  products: [],
});

function FilterContent({ open, submit, filterOptions, filters }) {
  const [localFilters, setFilters] = useState(filters);

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
    setFilters(getEmptyObject());
    submit(getEmptyObject());
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
          <PlanYearOptions
            filterOptions={filterOptions}
            onUpdateFilters={onUpdateFilters}
            filters={localFilters}
          />
        </Box>
        <Box>
          <FilterTabs
            filterOptions={filterOptions}
            onUpdateFilters={onUpdateFilters}
            filters={localFilters}
          />
        </Box>
      </Box>
      <FilterButtons reset={onResetHandle} apply={onApplyHanle} />
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
