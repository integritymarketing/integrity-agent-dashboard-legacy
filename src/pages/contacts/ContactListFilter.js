import React, { useState, useEffect, useContext } from "react";
import Filters from "components/icons/filters";
import FilterClose from "components/icons/filterClose";
import FilterOpen from "components/icons/filterOpen";
import Close from "components/icons/close";
import { Button } from "components/ui/Button";
import styles from "./ContactsPage.module.scss";
import Switch from "components/ui/switch";
import { useHistory, useLocation } from "react-router-dom";
import stageSummaryContext from "contexts/stageSummary";

const ContactRecordTypes = ["Prospect", "Client"];

export default () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { stageSummaryData, loadStageSummaryData } = useContext(
    stageSummaryContext
  );

  const [filters, setFilters] = useState({
    contactRecordType: "",
    stages: [],
    hasReminder: false,
  });

  useEffect(() => {
    const loadAsyncData = async () => {
      await loadStageSummaryData();
    };
    loadAsyncData();
    // ensure this only runs once.. adding a dependency w/ the stage summary data causes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const stages = queryParams.get("Stage");
    const contactRecordType = queryParams.get("ContactRecordType");
    const hasReminder = queryParams.get("HasReminder");
    const applyFilters = {
      contactRecordType: contactRecordType ? contactRecordType : "",
      hasReminder: hasReminder === "true" ? true : false,
      stages: stages ? stages.split(",").map(Number) : [],
    };
    if (applyFilters?.stages && applyFilters?.stages.length > 0) {
      setStageOpen(true);
    } else {
      setStageOpen(false);
    }
    if (
      (stages && applyFilters?.stages.length > 0) ||
      contactRecordType ||
      hasReminder
    ) {
      setFilters(applyFilters);
    } else {
      setFilters({
        contactRecordType: "",
        stages: [],
        hasReminder: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, filterOpen]);

  const selectStage = (id) => {
    let isExist = filters?.stages?.findIndex((statusId) => statusId === id);
    let newStages = filters?.stages;
    if (isExist > -1) {
      newStages.splice(isExist, 1);
    } else {
      newStages.push(id);
    }
    setFilters((previousData) => ({ ...previousData, stages: [...newStages] }));
  };

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

  const getFullCount = () => {
    let fullCount = 0;
    stageSummaryData.map((status) => {
      fullCount += status?.totalCount;
      return fullCount;
    });
    return fullCount;
  };

  const resetFilters = () => {
    history.push(`/contacts/list`);
    let resetData = {
      contactRecordType: "",
      stages: [],
      hasReminder: false,
    };
    setFilters(resetData);
    closeFilterSection();
  };

  const onApplyFilters = () => {
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
    searchParams.set("ContactRecordType", filters?.contactRecordType);
    searchParams.set("Stage", filters?.stages);
    searchParams.set("HasReminder", filters?.hasReminder);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
    closeFilterSection();
  };

  const closeFilterSection = () => {
    setFilterOpen(false);
    setStageOpen(false);
  };
  return (
    <div className={styles["filter-view"]}>
      <div className={styles.filterFunctionTitle}>Filter</div>
      <Button
        data-gtm="contacts-filter"
        icon={<Filters />}
        className={`${filterOpen ? styles.openFilter : ""} ${
          styles["filter-button"]
        } filterBtn`}
        type="primary"
        onClick={() => setFilterOpen(!filterOpen)}
      />
      {filterOpen && (
        <div className={`${styles.filterCard} contact-list-filters`}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitleSection}>
              <div className={styles.filterTitle}>Filter</div>
              <Close onClick={() => setFilterOpen(!filterOpen)} />
            </div>
            <div>
              <div className={styles.contactRecordTxt}>Contact Record Type</div>
              <ul className={styles.filterTabs}>
                <li
                  className={
                    filters?.contactRecordType === ""
                      ? styles.filterTabsActive
                      : ""
                  }
                  onClick={() =>
                    setFilters((previousData) => ({
                      ...previousData,
                      contactRecordType: "",
                    }))
                  }
                >
                  All
                </li>
                {ContactRecordTypes &&
                  ContactRecordTypes.map((recordType, r_index) => {
                    return (
                      <li
                        key={`${r_index}-${recordType}`}
                        className={
                          filters?.contactRecordType === recordType
                            ? styles.filterTabsActive
                            : ""
                        }
                        onClick={() =>
                          setFilters((previousData) => ({
                            ...previousData,
                            contactRecordType: recordType,
                          }))
                        }
                      >
                        {recordType}s
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className={styles.filterStage}>
              <div className={styles.filterStageTitle}>Stage</div>

              {stageOpen ? (
                <FilterClose
                  className={styles.pointCursor}
                  onClick={() => setStageOpen(!stageOpen)}
                />
              ) : (
                <FilterOpen
                  className={styles.pointCursor}
                  onClick={() => setStageOpen(!stageOpen)}
                />
              )}
            </div>
            {stageOpen && (
              <ul className={styles.filterStageList}>
                <li
                  className={
                    filters?.stages?.length === 0
                      ? styles.filterStageListActive
                      : ""
                  }
                  onClick={() =>
                    setFilters((previousData) => ({
                      ...previousData,
                      stages: [],
                    }))
                  }
                >
                  <span className={styles.filterStageListLeft}>All</span>
                  <span className={styles.filterStageListRight}>
                    {getFullCount()}
                  </span>
                </li>
                {stageSummaryData &&
                  stageSummaryData.map((status, s_index) => {
                    return (
                      <li
                        key={`${s_index}-${status?.statusName}`}
                        className={
                          filters?.stages.filter(
                            (id) => id === status.leadStatusId
                          )?.length > 0
                            ? styles.filterStageListActive
                            : ""
                        }
                        onClick={() => selectStage(status?.leadStatusId)}
                      >
                        <span className={styles.filterStageListLeft}>
                          {status?.statusName}
                        </span>
                        <span className={styles.filterStageListRight}>
                          {status?.totalCount}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
            <div className={styles.hasReminderToggle}>
              <div className={styles.hasReminderTxt}>Has Reminder</div>
              <div className={styles.hasReminderSwitcher}>
                <Switch
                  onChange={() =>
                    setFilters((previousData) => ({
                      ...previousData,
                      hasReminder: !filters?.hasReminder,
                    }))
                  }
                  defaultChecked={filters?.hasReminder}
                />
              </div>
            </div>
          </div>
          <div className={styles.filterButton}>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
            <button className={styles.applyButton} onClick={onApplyFilters}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
