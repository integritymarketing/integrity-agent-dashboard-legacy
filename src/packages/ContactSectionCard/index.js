import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import styles from "./index.module.scss";

const ContactSectionCard = (props) => {
  const { title, actions, children, className = "" } = props;
  const [isCollapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <section className={className}>
      <div className={styles.cardHeader}>
        <IconButton className={styles.icon} onClick={handleToggle}>
          {isCollapsed ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <h3 className={styles.heading}>{title}</h3>
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
