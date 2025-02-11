import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./SelectCounty.module.scss";
import { SELECT_COUNTY } from "components/AddZipContainer/AddZipContainer.constants";
import RadioUnchecked from "components/icons/radio-unchecked";
import RadioChecked from "components/icons/radio-checked";

export const SelectCounty = ({ counties, isMobile, onSelectCounty }) => {
    const [selectedCounty, setSelectedCounty] = useState("");

    const onSelect = (value) => {
        setSelectedCounty(value);
        onSelectCounty(counties.find((county) => county.value === value));
    };

    return (
        <>
            <div className={styles.title}>{SELECT_COUNTY}</div>
            <div className={`${styles.radioWrapper} ${isMobile ? styles.bkgWrapper : ""}`}>
                {counties.map((county) => {
                    const checked = selectedCounty === county.value;
                    return (
                        <div
                            key={county.value}
                            className={`${styles.radioLabel} ${isMobile ? styles.bkgLabel : ""} ${
                                checked ? styles.selectedBkg : ""
                            }`}
                            onClick={() => onSelect(county.value)}
                        >
                            <input
                                type="radio"
                                className={styles.radioInput}
                                name={"county"}
                                value={county.value}
                                checked={checked}
                            />
                            {checked ? <RadioChecked /> : <RadioUnchecked />}
                            <span>{county.label}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

SelectCounty.propTypes = {
    counties: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    isMobile: PropTypes.bool.isRequired,
    onSelectCounty: PropTypes.func.isRequired,
};
