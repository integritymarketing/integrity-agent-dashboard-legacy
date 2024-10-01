import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import { Switch } from "@mui/material";

import styles from "./styles.module.scss";

function SectionItem({ title, subTitle, actionTitle, action, actionIcon, icon, checked, onChange, disabled }) {
    return (
        <Box className={styles.section}>
            <Box display="flex" alignItems="center" gap="5px">
                <Box className={styles.iconTitle}>
                    <Box className={styles.icon}>{icon}</Box>
                    <Box className={styles.title}>{title}</Box>
                </Box>
                <Box className={styles.actionTitle}>
                    {actionTitle && action ? (
                        <Box display="flex" gap="3px" onClick={action}>
                            {actionTitle}
                            {actionIcon && <Box>{actionIcon}</Box>}
                        </Box>
                    ) : (
                        <Box></Box>
                    )}
                    <Switch
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        variant="availability"
                        inputProps={{ "aria-label": "controlled" }}
                    />
                </Box>
            </Box>
            {subTitle && <Box className={styles.subTitle}>{subTitle}</Box>}
        </Box>
    );
}

SectionItem.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    actionTitle: PropTypes.string,
    action: PropTypes.func,
    icon: PropTypes.element,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    actionIcon: PropTypes.element,
};

export default SectionItem;
