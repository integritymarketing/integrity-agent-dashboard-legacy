import React, { useState, useEffect, useMemo } from "react";
import Filters from "components/icons/filters";
import Check from "components/icons/check-blue";
import Close from "components/icons/close";
import { Button } from "components/ui/Button";
import styles from "./ActiveSellingPermissionFilter.module.scss";

const FILTER_OPTIONS = ['Carrier', 'State', 'PlanType'];

const ListOptions = ({ options, selected = {}, toggleSelection }) => {
  const oddList = useMemo(() => options.filter((_option, idx) => idx % 2 === 0), [options])
  const evenList = useMemo(() => options.filter((_option, idx) => idx % 2 === 1), [options])
  
  return (<div className={styles.listContainer}>
    <div className={styles.oddList}>
      {oddList.map(option => <div key={option} className={styles.listItem} onClick={() => toggleSelection(option)}>
        <span className={styles.listItemLabel}>{option}</span>
        <span className={`${styles.listItemSelected} ${selected[option] ? styles.selected : ''}`}><Check /></span>
      </div>)}
    </div>
    <div className={styles.evenList}>
      {evenList.map(option => <div key={option} className={styles.listItem} onClick={() => toggleSelection(option)}>
        <span className={styles.listItemLabel}>{option}</span>
        <span className={`${styles.listItemSelected} ${selected[option] ? styles.selected : ''}`}><Check /></span>
      </div>)}
    </div>
  </div>)
}

const defaultFilters = {
  State: {},
  Carrier: {},
  PlanType: {},
}

export default ({ onSubmit, filterOptions }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Carrier");

  const [filters, setFilters] = useState(defaultFilters)

  const carriers = filterOptions.Carrier;
  const states = filterOptions.State;
  const planTypes = filterOptions.PlanType;

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
    setFilters(defaultFilters)
  }

  const handleOnApply = () => {
    onSubmit && onSubmit(filters)
    setFilterOpen(false)
  }

  const handleOptionClick = (option) => {
    setFilters(filters => {
      return {
        ...filters,
        [activeTab]: {
          ...filters[activeTab],
          [option]: !Boolean(filters[activeTab][option]),
        }
      }
    })
  }

  function getListOptionParams() {
    if (activeTab === 'Carrier') {
      return {
        options: carriers,
        toggleSelection: handleOptionClick,
        selected: filters.Carrier
      }
    } else if (activeTab === 'State') {
      return {
        options: states,
        toggleSelection: handleOptionClick,
        selected: filters.State
      }
    } else if (activeTab === 'PlanType') {
      return {
        options: planTypes,
        toggleSelection: handleOptionClick,
        selected: filters.PlanType
      }
    }
  }

  return (
    <div className={styles["filter-view"]}>
      <Button
        data-gtm="rts-filter"
        icon={<Filters />}
        className={`${filterOpen ? styles.openFilter : ""} ${styles["filter-button"]
          } filterBtn`}
        type="primary"
        onClick={() => setFilterOpen(!filterOpen)}
      />
      {filterOpen && (
        <div className={`${styles.filterCard} contact-list-filters`}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitleSection}>
              <div className={styles.filterTitle}>Filter By</div>
              <Close onClick={() => setFilterOpen(!filterOpen)} />
            </div>
            <div>
              <ul className={styles.filterTabs}>
                {FILTER_OPTIONS.map(option =>
                  <li
                    key={option}
                    className={
                      activeTab === option
                        ? styles.filterTabsActive
                        : ""
                    }
                    onClick={() =>
                      setActiveTab(option)
                    }
                  >
                    {option}
                  </li>
                )}
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
    </div>
  );
};
