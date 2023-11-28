import { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import _ from "lodash";

import FilterButtons from "./FilterButtons/FilterButtons";
import { FilterTabs } from "./FilterTabs";
import { PlanYearOptions } from "./PlanYearOptions";
import styles from "./styles.module.scss";

import { useAPHealthContext } from "../../providers/APHealthProvider";

const getEmptyObject = () => ({
    carriers: [],
    states: [],
    years: [],
    products: [],
});

function FilterContent() {
    const { setFilters, filters, setOpenFilter, openFilter } = useAPHealthContext();
    const [localFilters, setLocalFilters] = useState({});

    const onUpdateFilters = (value, field) => {
        setLocalFilters((prevFilters) => {
            const updatedFilters = _.cloneDeep(prevFilters);
            updatedFilters[field] = updatedFilters[field] || [];

            if (updatedFilters[field].includes(value)) {
                updatedFilters[field] = updatedFilters[field].filter((item) => item !== value);
            } else {
                updatedFilters[field].push(value);
            }

            return updatedFilters;
        });
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
        setLocalFilters(_.cloneDeep(filters));
    }, [filters]);

    useEffect(() => {
        const closeFilters = (event) => {
            if (event.target.closest(".filterBtn") || event.target.closest(".filterContent")) {
                return;
            }
            if (openFilter) {
                setFilters(_.cloneDeep(filters));
            }
            setOpenFilter(false);
        };

        document.body.addEventListener("click", closeFilters);
        return () => {
            document.body.removeEventListener("click", closeFilters);
        };
    }, [setOpenFilter, setFilters, filters, openFilter]);

    if (!openFilter) {
        return <></>;
    }

    return (
        <Box className={`${styles.filterContent} filterContent`}>
            <Box className={styles.contentInner}>
                <Box className={styles.filterTitle}>Filter By</Box>
                <Box className={styles.section}>
                    <PlanYearOptions onUpdateFilters={onUpdateFilters} filters={localFilters} />
                </Box>
                <Box>
                    <FilterTabs onUpdateFilters={onUpdateFilters} filters={localFilters} />
                </Box>
            </Box>
            <FilterButtons reset={onResetHandle} apply={onApplyHandle} />
        </Box>
    );
}

export default FilterContent;
