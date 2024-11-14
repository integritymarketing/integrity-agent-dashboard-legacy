import PropTypes from "prop-types";
import { FormControlLabel, Radio } from "@mui/material";
import styles from "./CustomRadioGroupOption.module.scss";

function CustomRadioGroupOption({ label, value, key, stateValue, onChange, name }) {
    return (
        <>
            <FormControlLabel
                key={key}
                className={`${styles.radioLabel} ${stateValue == value ? styles.isSelected : ""}`}
                sx={{ "& .MuiButtonBase-root.MuiRadio-root": { display: "none" } }}
                value={value}
                control={
                    <Radio
                        name={name}
                        checked={stateValue == value}
                        onChange={onChange}
                        checkedIcon={<></>}
                        icon={<></>}
                    />
                }
                label={label}
            />
        </>
    );
}

CustomRadioGroupOption.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stateValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default CustomRadioGroupOption;
