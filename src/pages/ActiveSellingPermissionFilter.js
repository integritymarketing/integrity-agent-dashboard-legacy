import React, { useState, useEffect, useMemo } from "react";
import Filters from "components/icons/filters";
import Check from "components/icons/check-blue";
import Close from "components/icons/close";
import { Button } from "components/ui/Button";
import styles from "./ActiveSellingPermissionFilter.module.scss";

const FILTER_OPTIONS = ["Carrier", "State", "PlanType"];

const Pills = ({ planYear, handleYearfilter, selectedYr }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemClick = (item) => {
    const index = selectedItems.indexOf(item);
    if (index === -1) {
      const newItems = [...selectedItems, item];
      setSelectedItems(newItems);
      handleYearfilter(newItems);
    } else {
      const newItems = selectedItems.filter((i) => i !== item);
      setSelectedItems(newItems);
      handleYearfilter(newItems);
    }
  };

  return (
    <>
      <div className={styles.yearLabel}>Plan Year</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {planYear.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item)}
            className={styles.yearOptionsList}
          >
            {item}
            {selectedYr[item] && (
              <span>
                <Check />
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const ListOptions = ({
  options,
  selected = {},
  toggleSelection,
  activeTab,
}) => {
  const oddList = useMemo(
    () => options.filter((_option, idx) => idx % 2 === 0),
    [options]
  );
  const evenList = useMemo(
    () => options.filter((_option, idx) => idx % 2 === 1),
    [options]
  );

  return (
    <div
      className={`${styles.listContainer} ${
        activeTab.replace(/\s+/g, "").toLowerCase() === "carrier"
          ? styles.carrier
          : ""
      }`}
      style={{ height: `${window.innerHeight / 2 - 200}px` }}
    >
      <div className={styles.oddList}>
        {oddList.map((option) => (
          <div
            key={option}
            className={styles.listItem}
            onClick={() => toggleSelection(option)}
          >
            <span className={styles.listItemLabel}>{option}</span>
            <span
              className={`${styles.listItemSelected} ${
                selected[option] ? styles.selected : ""
              }`}
            >
              <Check />
            </span>
          </div>
        ))}
      </div>
      <div className={styles.evenList}>
        {evenList.map((option) => (
          <div
            key={option}
            className={styles.listItem}
            onClick={() => toggleSelection(option)}
          >
            <span className={styles.listItemLabel}>{option}</span>
            <span
              className={`${styles.listItemSelected} ${
                selected[option] ? styles.selected : ""
              }`}
            >
              <Check />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const defaultFilters = {
  State: {},
  Carrier: {},
  PlanType: {},
  PlanYear: {},
};

export default ({ onSubmit, filterOptions }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Carrier");

  const [filters, setFilters] = useState(defaultFilters);

  const carriers = filterOptions.Carrier;
  const states = filterOptions?.State?.sort();
  const planTypes = filterOptions.PlanType;
  const planYear = filterOptions.PlanYear;

  useEffect(() => {
    const closeFilters = (event) => {
      if (
        event.target.closest(".contact-list-filters") ||
        event.target.closest(".filterBtn")
      ) {
        return;
      }
      closeFilterSection();
    };

    document.body.addEventListener("click", closeFilters);

    return () => document.body.removeEventListener("click", closeFilters);
  }, [filterOpen]);

  const closeFilterSection = () => {
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleOnApply = () => {
    onSubmit && onSubmit(filters);
    setFilterOpen(false);
  };

  const handleYearfilter = (option, activeTab = "PlanYear") => {
    setFilters((filters) => {
      return {
        ...filters,
        [activeTab]: {
          ...filters[activeTab],
          [option]: !Boolean(filters[activeTab][option]),
        },
      };
    });
  };

  const handleOptionClick = (option) => {
    setFilters((filters) => {
      return {
        ...filters,
        [activeTab]: {
          ...filters[activeTab],
          [option]: !Boolean(filters[activeTab][option]),
        },
      };
    });
  };

  function getListOptionParams() {
    if (activeTab === "Carrier") {
      return {
        options: carriers,
        toggleSelection: handleOptionClick,
        selected: filters.Carrier,
        activeTab,
      };
    } else if (activeTab === "State") {
      return {
        options: states,
        toggleSelection: handleOptionClick,
        selected: filters.State,
        activeTab,
      };
    } else if (activeTab === "PlanType") {
      return {
        options: planTypes,
        toggleSelection: handleOptionClick,
        selected: filters.PlanType,
        activeTab,
      };
    }
  }

  return (
    <div className={styles["filter-view"]}>
      <Button
        data-gtm="rts-filter"
        icon={<Filters />}
        className={`${filterOpen ? styles.openFilter : ""} ${
          styles["filter-button"]
        } filterBtn`}
        type="primary"
        onClick={() => setFilterOpen(!filterOpen)}
        label=""
      />
      {filterOpen && (
        <div className={`${styles.filterCard} contact-list-filters`}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitleSection}>
              <div className={styles.filterTitle}>Filter By</div>
              <Close onClick={() => setFilterOpen(!filterOpen)} />
            </div>

            <div>
              <Pills
                handleYearfilter={handleYearfilter}
                planYear={planYear}
                selectedYr={filters.PlanYear}
              />
            </div>

            <div>
              <ul className={styles.filterTabs}>
                {FILTER_OPTIONS.map((option) => (
                  <li
                    key={option}
                    className={
                      activeTab === option ? styles.filterTabsActive : ""
                    }
                    onClick={() => setActiveTab(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>

              <div>
                <ListOptions {...getListOptionParams()} />
              </div>
            </div>
            <div className={styles.filterButton}>
              <button className={styles.resetButton} onClick={resetFilters}>
                Reset
              </button>
              <button className={styles.applyButton} onClick={handleOnApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {filterOpen && <div className={styles.drawerOverlay}></div>}
    </div>
  );
};
