import { useState } from "react";

import PropTypes from "prop-types";

import usePreferences from "hooks/usePreferences";

import ArrowDownBig from "components/icons/version-2/ArrowDownBig";

import styles from "./index.module.scss";

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
        customStyle = "",
        titleWidth,
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
            <div className={`${styles.cardHeader} ${customStyle}`} style={{ boxShadow: cardBorderClassName }}>
                <div className={styles.iconWithTitle} style={titleWidth ? { width: "90%" } : {}}>
                    <div className={`${styles.icon} ${isCollapsed ? styles.iconRotate : ""}`} onClick={handleToggle}>
                        <ArrowDownBig />
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
