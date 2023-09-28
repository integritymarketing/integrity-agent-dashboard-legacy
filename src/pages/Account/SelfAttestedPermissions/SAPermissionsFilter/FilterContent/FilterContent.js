import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import FilterButtons from "./FilterButtons/FilterButtons";
import { FilterTabs } from "./FilterTabs";
import { PlanYearOptions } from "./PlanYearOptions";
import { useSAPermissionsContext } from "../../providers/SAPermissionProvider";

import styles from "./styles.module.scss";

const getEmptyObject = () => ({
  carriers: [],
  states: [],
  years: [],
  products: [],
});

function FilterContent() {
  const { setFilters, filters, setOpenFilter, openFilter } =
    useSAPermissionsContext();
  const [localFilters, setLocalFilters] = useState({});

  const onUpdateFilters = (value, field) => {
    const updatedFilters = JSON.parse(JSON.stringify(localFilters));
    updatedFilters[field] = updatedFilters[field] || [];
    if (updatedFilters[field].includes(value)) {
      updatedFilters[field] = updatedFilters[field].filter(
        (item) => item !== value
      );
    } else {
      updatedFilters[field].push(value);
    }
    setLocalFilters(updatedFilters);
  };

  const onResetHandle = () => {
    setLocalFilters(getEmptyObject());
    setFilters(getEmptyObject());
    setOpenFilter(false);
  };

  const onApplyHandle = () => {
    setFilters(localFilters);
    setOpenFilter(false);
  };

  useEffect(() => {
    setLocalFilters(JSON.parse(JSON.stringify(filters)));
  }, [setLocalFilters, filters]);

  if (!openFilter) return <></>;

  return (
    <Box className={`${styles.filterContent} filterContent`}>
      <Box className={styles.contentInner}>
        <Box className={styles.filterTitle}>Filter By</Box>
        <Box className={styles.section}>
          <PlanYearOptions
            onUpdateFilters={onUpdateFilters}
            filters={localFilters}
          />
        </Box>
        <Box>
          <FilterTabs
            onUpdateFilters={onUpdateFilters}
            filters={localFilters}
          />
        </Box>
      </Box>
      <FilterButtons reset={onResetHandle} apply={onApplyHandle} />
    </Box>
  );
}

export default FilterContent;
