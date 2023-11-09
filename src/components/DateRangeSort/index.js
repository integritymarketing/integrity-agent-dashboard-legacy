import React, { useState } from "react";
import DateRange from "components/icons/DateRange";
import Arrow from "components/icons/down";
import { DASHBOARD_SORT_OPTIONS } from "../../constants";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";
import Media from "react-media";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

export default function DateRangeSort({
  preferencesKey,
  dateRange,
  setDateRange,
  page = "",
}) {
  const [, setValue] = usePreferences(0, preferencesKey);

  const [isOpen, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleSelect = (value) => {
    setDateRange(value);
    setValue(value);
    setOpen(false);
  };
  return (
    <>
      <Media
        query={"(max-width: 768px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <div
        className={
          page !== "taskListMobileLayout" && isMobile
            ? styles.maxWidthMobile
            : styles.sortSelector
        }
      >
        {isMobile && page !== "taskListMobileLayout" ? (
          <div
            onClick={() => {
              setOpen(!isOpen);
            }}
          >
            <DateRange />
          </div>
        ) : (
          <div className={styles.sortButton}>
            <div>
              <DateRange />
            </div>
            <div>{DASHBOARD_SORT_OPTIONS[dateRange]?.label}</div>
            <div
              className={`${styles.icon} ${isOpen ? styles.iconReverse : ""}`}
              onClick={() => {
                setOpen(!isOpen);
              }}
            >
              <Arrow color={"#0052CE"} />
            </div>
          </div>
        )}
        {isOpen && (
          <div
            className={
              page !== "taskListMobileLayout" && isMobile
                ? `${styles.options} ${styles.optionsMobile}`
                : styles.options
            }
          >
            {DASHBOARD_SORT_OPTIONS.map((option) => {
              return (
                <div
                  key={`${option.label}`}
                  className={styles.option}
                  onClick={() => handleSelect(option.value)}
                >
                  <div>{option.label}</div>

                  <div className={styles.mark}>
                    <CheckMark show={dateRange === option.value} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
