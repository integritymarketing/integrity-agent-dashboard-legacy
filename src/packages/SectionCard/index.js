import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ArrowDownBig from "components/icons/version-2/ArrowDownBig";
import usePreferences from "hooks/usePreferences";
import styles from "./index.module.scss";

const SectionCard = ({
    title,
    actions,
    children,
    className = "",
    infoIcon,
    preferencesKey,
    hideActionIfCollapse = false,
    isDashboard = false,
    contentClassName,
}) => {
    const [value, setValue] = usePreferences(false, preferencesKey);
    const [isCollapsed, setCollapsed] = useState(value);

    const handleToggle = () => {
        setCollapsed(!isCollapsed);
        setValue(!isCollapsed, preferencesKey);
    };

    const cardBorderClassName =
        (isDashboard && isCollapsed) || (!isDashboard && !isCollapsed) ? "inset 0px -1px 0px #c7ccd1" : "";

    return (
        <section className={className}>
            <Box className={styles.cardHeader} style={{ boxShadow: cardBorderClassName }}>
                <Box className={styles.iconWithTitle}>
                    <Box className={`${styles.icon} ${isCollapsed ? styles.iconRotate : ""}`} onClick={handleToggle}>
                        <ArrowDownBig />
                    </Box>
                    <h3 className={styles.heading}>{title}</h3>
                    {infoIcon && <Box className={styles.infoIcon}>{infoIcon} </Box>}
                </Box>
                {!(hideActionIfCollapse && isCollapsed) && <div className={styles.actions}>{actions}</div>}
            </Box>
            {!isCollapsed && <Box className={contentClassName || styles.content}>{children}</Box>}
        </section>
    );
};

SectionCard.propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.node,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    infoIcon: PropTypes.node,
    preferencesKey: PropTypes.string,
    hideActionIfCollapse: PropTypes.bool,
    isDashboard: PropTypes.bool,
    contentClassName: PropTypes.string,
};

export default SectionCard;
