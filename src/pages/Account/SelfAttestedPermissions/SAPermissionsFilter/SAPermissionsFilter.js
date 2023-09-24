import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";

import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import { FilterContent } from "./FilterContent";
import { useSAPermissionsContext } from "../SAPermissionProvider";

import styles from "./styles.module.scss";

function SAPermissionsFilter() {
  const { openFilter, setOpenFilter } = useSAPermissionsContext();

  useEffect(() => {
    const closeFilters = (event) => {
      if (
        event.target.closest(".filterBtn") ||
        event.target.closest(".filterContent")
      ) {
        return;
      }
      setOpenFilter(false);
    };
    document.body.addEventListener("click", closeFilters);
    return () => document.body.removeEventListener("click", closeFilters);
  }, [openFilter]);

  return (
    <Box className={styles.customFilter}>
      <Button
        className={`${styles.filterButton} filterBtn`}
        icon={openFilter ? <ActiveFilter /> : <FilterIcon />}
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          setOpenFilter(!openFilter);
        }}
        label=""
      />
      <FilterContent />
      {openFilter && <Box className={styles.drawerOverlay}></Box>}
    </Box>
  );
}

export default SAPermissionsFilter;
