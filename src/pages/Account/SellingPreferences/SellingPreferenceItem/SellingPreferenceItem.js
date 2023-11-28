import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { Switch } from "components/ui/version-2/Swich";

import styles from "./styles.module.scss";

const SellingPreferenceItem = ({ title, description, checked, onChange, disabled }) => (
    <Box className={styles.box}>
        <Box>
            <Box className={styles.subTitle}>{title}</Box>
            <Box className={styles.text}>{description}</Box>
        </Box>
        <Switch defaultChecked={checked} disabled={disabled} onChange={onChange} />
    </Box>
);

SellingPreferenceItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default SellingPreferenceItem;
