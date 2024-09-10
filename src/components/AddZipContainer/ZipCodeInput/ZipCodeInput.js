import PropTypes from "prop-types";
import styles from "./ZipCodeInput.module.scss";
import { ZIP_CODE, ZIP_ERROR } from "components/AddZipContainer/AddZipContainer.constants";

export const ZipCodeInput = ({
    handleZipCode,
    zipError,
    defaultValue = "",
    label = ZIP_CODE,
    errorMessage = ZIP_ERROR,
}) => {
    return (
        <>
            <div className={styles.title}>{label}</div>
            <input
                type="text"
                className={styles.input}
                defaultValue={defaultValue}
                required
                minLength={5}
                maxLength={5}
                onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
                    e.target.value = sanitizedValue;
                    handleZipCode(sanitizedValue);
                }}
            />
            {zipError && <div className={styles.error}>{errorMessage}</div>}
        </>
    );
};

ZipCodeInput.propTypes = {
    handleZipCode: PropTypes.func.isRequired,
    zipError: PropTypes.bool,
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    errorMessage: PropTypes.string,
};

ZipCodeInput.defaultProps = {
    zipError: false,
    defaultValue: "",
    label: ZIP_CODE,
    errorMessage: ZIP_ERROR,
};
