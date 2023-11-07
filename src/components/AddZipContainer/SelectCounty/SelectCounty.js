import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./SelectCounty.module.scss";
import Radio from "components/ui/Radio";
import { SELECT_COUNTY } from "components/AddZipContainer/AddZipContainer.constants";

export const SelectCounty = ({ counties, isMobile, onSelectCounty }) => {
    const [selectedCounty, setSelectedCounty] = useState("");

    const onChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCounty(selectedValue);
        onSelectCounty(counties.find((county) => county.value === selectedValue));
    };

    return (
        <>
            <div className={styles.title}>{SELECT_COUNTY}</div>
            <div className={`${styles.radioWrapper} ${isMobile ? styles.bkgWrapper : ""}`}>
                {counties.map((county, index) => (
                    <Radio
                        id={county.label}
                        className={`${styles.radioLabel} ${isMobile ? styles.bkgLabel : ""}`}
                        key={`${county.label}-${index}`}
                        name="county"
                        value={county.value}
                        label={county.label}
                        checked={selectedCounty === county.value}
                        onChange={onChange}
                    />
                ))}
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