import { useState } from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import Check from "components/icons/check-blue";

import { useAPHealthContext } from "pages/Account/ActivePermissions/providers/APHealthProvider";

import styles from "./styles.module.scss";

const TABS = { Carrier: "carriers", State: "states", Product: "products" };
const TABS_KEYS = Object.keys(TABS);

function FilterTabs({ onUpdateFilters, filters }) {
    const [activeTab, setActiveTab] = useState(TABS.Carrier);
    const { filterOptions } = useAPHealthContext();

    const activeOptions = filterOptions[activeTab] || [];
    const leftList = activeOptions.filter((_, i) => i % 2 === 0);
    const rightList = activeOptions.filter((_, i) => i % 2 === 1);

    return (
        <>
            <Box className={styles.filterTabs}>
                {TABS_KEYS.map((tab) => (
                    <Box
                        key={tab}
                        className={activeTab === TABS[tab] ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab(TABS[tab])}
                    >
                        {tab}
                    </Box>
                ))}
            </Box>
            <Box className={styles.listsContainer}>
                <Box className={styles.list}>
                    {leftList.map((option) => (
                        <Box key={option} className={styles.item} onClick={() => onUpdateFilters(option, activeTab)}>
                            <Box> {option}</Box>
                            {filters[activeTab].includes(option) && <Check />}
                        </Box>
                    ))}
                </Box>
                <Box className={styles.list}>
                    {rightList.map((option) => (
                        <Box key={option} className={styles.item} onClick={() => onUpdateFilters(option, activeTab)}>
                            <Box>{option}</Box>
                            {filters[activeTab].includes(option) && <Check />}
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}

FilterTabs.propTypes = {
    onUpdateFilters: PropTypes.func,
    filters: PropTypes.object,
};

export default FilterTabs;
