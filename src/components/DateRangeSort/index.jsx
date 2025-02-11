import React, { useState, useEffect, useRef } from "react";
import DateRange from "components/icons/DateRange";
import Arrow from "components/icons/down";
import { DASHBOARD_SORT_OPTIONS } from "../../constants";
import CheckMark from "packages/ContactListFilterOptions/CheckMarkIcon/CheckMark";
import Media from "react-media";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";
import { useOnClickOutside } from "hooks/useOnClickOutside";

export default function DateRangeSort({ preferencesKey, dateRange, setDateRange, page = "" }) {
    const [, setValue] = usePreferences(0, preferencesKey);
    const [isOpen, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => {
        if (open) {
            setOpen(false);
        }
    });

    const handleSelect = (value) => {
        setDateRange(value);
        setValue(value);
        setOpen(false);
    };

    const renderOptions = () => (
        <div
            className={
                page !== "taskListMobileLayout" && isMobile
                    ? `${styles.options} ${styles.optionsMobile}`
                    : styles.options
            }
        >
            {DASHBOARD_SORT_OPTIONS.map((option) => (
                <div key={option.label} className={styles.option} onClick={() => handleSelect(option.value)}>
                    <div>{option.label}</div>
                    <div className={styles.mark}>
                        <CheckMark show={dateRange === option.value} />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSortButton = () => (
        <div className={styles.sortButton}>
            <div>
                <DateRange />
            </div>
            <div>{DASHBOARD_SORT_OPTIONS[dateRange]?.label}</div>
            <div className={`${styles.icon} ${isOpen ? styles.iconReverse : ""}`} onClick={() => setOpen(!isOpen)}>
                <Arrow color={"#0052CE"} />
            </div>
        </div>
    );

    const renderMobileButton = () => (
        <div onClick={() => setOpen(!isOpen)}>
            <DateRange />
        </div>
    );

    return (
        <>
            <Media query={"(max-width: 768px)"} onChange={(isMobile) => setIsMobile(isMobile)} />
            <div
                ref={ref}
                className={page !== "taskListMobileLayout" && isMobile ? styles.maxWidthMobile : styles.sortSelector}
            >
                {isMobile && page !== "taskListMobileLayout" ? renderMobileButton() : renderSortButton()}
                {isOpen && renderOptions()}
            </div>
        </>
    );
}
