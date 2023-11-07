import React from "react";
import PropTypes from "prop-types";
import styles from "./ZipCodeInput.module.scss";
import { ZIP_CODE, ZIP_ERROR } from "components/AddZipContainer/AddZipContainer.constants";

export const ZipCodeInput = ({ handleZipCode, zipError }) => {

    return (
        <>
            <div className={styles.title}>{ZIP_CODE}</div>
            <input
                type="text"
                className={styles.input}
                required
                minLength={5}
                maxLength={5}
                onChange={(e) => {
                    e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .toString()
                        .slice(0, 5);
                    handleZipCode(e.target.value);
                }}
            />
            {zipError && <div className={styles.error}>{ZIP_ERROR}</div>}
        </>)
}

ZipCodeInput.propTypes = {
    handleZipCode: PropTypes.func.isRequired,
};