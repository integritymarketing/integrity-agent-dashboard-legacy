import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";

import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import { FilterContent } from "./FilterContent";

import styles from "./styles.module.scss";

function SAPermissionsFilter({ setFilters, filterOptions, filters }) {
  const [open, setOpen] = useState(false);

  const onSubmitHandle = (newFilters) => {
    setOpen(false);
    setFilters(newFilters);
  };

  useEffect(() => {
    const closeFilters = (event) => {
      console.log(event.target);
      if (
        event.target.closest(".filterBtn") ||
        event.target.closest(".filterContent")
      ) {
        return;
      }
      setOpen(false);
    };
    document.body.addEventListener("click", closeFilters);
    return () => document.body.removeEventListener("click", closeFilters);
  }, [open]);

  return (
    <div className={styles.customFilter}>
      <Button
        className={`${styles.filterButton} filterBtn`}
        icon={open ? <ActiveFilter /> : <FilterIcon />}
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        label=""
      />
      <FilterContent
        open={open}
        filterOptions={filterOptions}
        submit={onSubmitHandle}
        filters={filters}
      />
    </div>
  );
}

SAPermissionsFilter.propTypes = {
  setFilters: PropTypes.func,
  filters: PropTypes.object,
  filterOptions: PropTypes.object,
};

export default SAPermissionsFilter;
