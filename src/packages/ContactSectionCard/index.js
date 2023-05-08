import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";
import Arrow from "components/icons/down";

const ContactSectionCard = (props) => {
  const { title, actions, children, className = "", infoIcon } = props;
  const [isCollapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <section className={className}>
      <div className={styles.cardHeader}>
        <div
          className={`${styles.icon} ${isCollapsed ? styles.iconReverse : ""}`}
          onClick={handleToggle}
        >
          <Arrow color={"#0052CE"} />
        </div>
        <h3 className={styles.heading}>{title}</h3>
        {infoIcon && <div className={styles.infoIcon}>{infoIcon} </div>}
        <div className={styles.actions}>{actions}</div>
      </div>
      {!isCollapsed && <div className={styles.content}>{children}</div>}
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
