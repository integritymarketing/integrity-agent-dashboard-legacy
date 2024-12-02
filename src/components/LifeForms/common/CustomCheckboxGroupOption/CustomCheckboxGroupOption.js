import PropTypes from "prop-types";
import { FormControlLabel, Checkbox } from "@mui/material";
import styles from "./CustomCheckboxGroupOption.module.scss";

function CustomCheckboxGroupOption({ label, value, stateValue, onChange, name }) {
    const isChecked = stateValue?.includes(value);

    return (
        <FormControlLabel
            className={`${styles.checkboxLabel} ${isChecked ? styles.isSelected : ""}`}
            control={
                <Checkbox
                    name={name}
                    checked={isChecked}
                    onChange={() => onChange(value)}
                    className={styles.hiddenCheckbox}
                />
            }
            label={<span>{label}</span>}
        />
    );
}

CustomCheckboxGroupOption.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stateValue: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default CustomCheckboxGroupOption;