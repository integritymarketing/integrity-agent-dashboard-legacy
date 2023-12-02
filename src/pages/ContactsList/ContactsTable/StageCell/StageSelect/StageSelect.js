import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import PropTypes from "prop-types";

import ArrowDownBlue from "components/icons/version-2/ArrowDownBlue";

import styles from "./styles.module.scss";

function StageSelect({ options, initialValue, onChange, customWidth, customHeight }) {
    const onItemClickHandle = (value) => {
        onChange(value);
    };

    return (
        <Select
            IconComponent={() => <ArrowDownBlue />}
            value={initialValue}
            sx={{
                svg: {
                    pointerEvents: "none",
                    position: "absolute",
                    right: "5px",
                },
                color: "#434A51",
                width: customWidth ? customWidth : "100%",
                height: customHeight ? customHeight : "35px",
                paddingRight: "5px",
                borderColor: "#DDDDDD",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#DDDDDD",
                },
                ".MuiSelect-outlined": { padding: "0px 7px", paddingRight: "0px !important" },
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" },
                "&:hover": { ".MuiOutlinedInput-notchedOutline": { borderColor: "#DDDDDD" } },
            }}
        >
            {options.map(({ value, label, color }) => (
                <MenuItem value={value} key={value} onClick={() => onItemClickHandle(value)}>
                    <Box display="flex" alignItems="center" gap="10px">
                        <span className={styles.dot} style={{ backgroundColor: color }}></span>
                        <Box>{label}</Box>
                    </Box>
                </MenuItem>
            ))}
        </Select>
    );
}

StageSelect.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
        })
    ).isRequired,
    initialValue: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    customWidth: PropTypes.string,
    customHeight: PropTypes.string,
};

export default StageSelect;
