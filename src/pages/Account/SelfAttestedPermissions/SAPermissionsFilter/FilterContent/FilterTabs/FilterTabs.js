import { useState, useMemo } from "react";
import PropTypes, { object } from "prop-types";
import Box from "@mui/material/Box";
import Check from "components/icons/check-blue";

import styles from "./styles.module.scss";

const TABS = { Carrier: "carriers", State: "states", Product: "products" };
const TABS_KEYS = Object.keys(TABS);

function FilterTabs({ filterOptions, onUpdateFilters, filters }) {
  const [activeTab, setActiveTab] = useState(TABS.Carrier);

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
            <Box
              className={styles.item}
              onClick={() => onUpdateFilters(option, activeTab)}
            >
              <Box> {option}</Box>
              {filters[activeTab].includes(option) && <Check />}
            </Box>
          ))}
        </Box>
        <Box className={styles.list}>
          {rightList.map((option) => (
            <Box
              className={styles.item}
              onClick={() => onUpdateFilters(option, activeTab)}
            >
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
  filterOptions: PropTypes.object,
  onUpdateFilterss: PropTypes.func,
  filters: PropTypes.object,
};

export default FilterTabs;
