import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FilterIcon from "components/icons/version-2/Filter";
import FilterActive from "components/icons/version-2/FilterActive";

import { FilterContent } from "./FilterContent";
import styles from "./styles.module.scss";

import { useSAHealthProductContext } from "../providers/SAHealthProductProvider";

function SAPermissionsFilter() {
    const { openFilter, setOpenFilter } = useSAHealthProductContext();

    return (
        <Box className={styles.customFilter}>
            <Button
                className={`${styles.filterButton} filterBtn`}
                endIcon={openFilter ? <FilterActive /> : <FilterIcon />}
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
