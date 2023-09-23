import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";

import Filter from "packages/Filter/Filter";
import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import { FilterContent } from "./FilterContent";
import { useActiveFilters } from "hooks/useActiveFilters";

import styles from "./styles.module.scss";

function SAPermissionsFilter({ setFilters, filterOptions, filters }) {
  const [open, setOpen] = useState(false);

  const onSubmitHandle = (newFilters) => {
    setOpen(false);
    setFilters(newFilters);
    console.log("newFilters", newFilters)
  };

  return (
    <Box className={styles.customFilter}>
      <Button
        className={styles.filterButton}
        icon={open ? <ActiveFilter /> : <FilterIcon />}
        type="primary"
        onClick={() => setOpen(!open)}
        label=""
      />
      <FilterContent
        open={open}
        filterOptions={filterOptions}
        submit={onSubmitHandle}
        filters={filters}
      />
    </Box>
  );
}

SAPermissionsFilter.propTypes = {
  setFilters: PropTypes.func,
  filters: PropTypes.object,
  filterOptions: PropTypes.object,
};

export default SAPermissionsFilter;
