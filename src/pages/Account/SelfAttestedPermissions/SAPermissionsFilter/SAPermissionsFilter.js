import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FilterIcon from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import { FilterContent } from "./FilterContent";
import { useSAPermissionsContext } from "../providers/SAPermissionProvider";

import styles from "./styles.module.scss";

function SAPermissionsFilter() {
  const { openFilter, setOpenFilter, filters, setFilters } =
    useSAPermissionsContext();

  useEffect(() => {
    const closeFilters = (event) => {
      if (
        event.target.closest(".filterBtn") ||
        event.target.closest(".filterContent")
      ) {
        return;
      }
      setFilters(JSON.parse(JSON.stringify(filters)));
      setOpenFilter(false);
    };
    document.body.addEventListener("click", closeFilters);
    return () => document.body.removeEventListener("click", closeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOpenFilter, filters]);

  return (
    <Box className={styles.customFilter}>
      <Button
        className={`${styles.filterButton} filterBtn`}
        endIcon={openFilter ? <ActiveFilter /> : <FilterIcon />}
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          setOpenFilter(!openFilter);
        }}
      />
      <FilterContent />
      {openFilter && <Box className={styles.drawerOverlay}></Box>}
    </Box>
  );
}

export default SAPermissionsFilter;
