import React, { useState } from "react";
import DateRange from "components/icons/DateRange";
import Arrow from "components/icons/down";
import { DASHBOARD_SORT_OPTIONS } from "../../constants";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";
import styles from "./styles.module.scss";

export default function DateRangeSort({ isMobile }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={styles.sortSelector}>
      {isMobile ? (
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
          <div>Current Year to Date</div>
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
        <div className={styles.options}>
          {DASHBOARD_SORT_OPTIONS.map((option) => {
            return (
              <div key={`${option.label}`} className={styles.option}>
                <div>{option.label}</div>
                <div className={styles.mark}>
                  <CheckMark show={true} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
