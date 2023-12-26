import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Check from "components/icons/check-blue";

import { useSAHealthProductContext } from "pages/Account/SelfAttestedPermissions/SAHealthProduct/providers/SAHealthProductProvider";

import styles from "./styles.module.scss";

function PlanYearOption({ onUpdateFilters, filters }) {
    const { filterOptions } = useSAHealthProductContext();
    const planYears = filterOptions.planYears;

    return (
        <>
            <Box className={styles.sectionTitle}>Plan Year</Box>
            <Box className={styles.planYears}>
                {planYears.map((year, index) => (
                    <Box key={index} className={styles.planYear} onClick={() => onUpdateFilters(year, "years")}>
                        <Box>{year}</Box>
                        {filters["years"].includes(year) && <Check />}
                    </Box>
                ))}
            </Box>
        </>
    );
}

PlanYearOption.propTypes = {
    onUpdateFilterss: PropTypes.func,
    filters: PropTypes.object,
};

export default PlanYearOption;
