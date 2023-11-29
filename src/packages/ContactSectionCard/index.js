import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import Arrow from "components/icons/down";
import usePreferences from "hooks/usePreferences";

const ContactSectionCard = (props) => {
    const {
        title,
        actions,
        children,
        className = "",
        infoIcon,
        preferencesKey,
        hideActionIfCollapse = false,
        isDashboard = false,
        contentClassName,
    } = props;
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
            <div className={styles.cardHeader} style={{ boxShadow: cardBorderClassName }}>
                <div className={styles.iconWithTitle}>
                    <div className={`${styles.icon} ${isCollapsed ? styles.iconReverse : ""}`} onClick={handleToggle}>
                        <Arrow color={"#0052CE"} />
                    </div>
                    <h3 className={styles.heading}>{title}</h3>
                    {infoIcon && <div className={styles.infoIcon}>{infoIcon} </div>}
                </div>
                {!(hideActionIfCollapse && isCollapsed) && <div className={styles.actions}>{actions}</div>}
            </div>
            {!isCollapsed && <div className={contentClassName ? contentClassName : styles.content}>{children}</div>}
        </section>
    );
};

ContactSectionCard.propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.node,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default ContactSectionCard;
