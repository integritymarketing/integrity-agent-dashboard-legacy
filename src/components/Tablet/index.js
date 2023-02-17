import React from "react";
import image from "./image.png";
import website from "./images/website.png";

import styles from "./styles.module.scss";

const Tablet = ({ className = "" }) => (
  <div className={`${className} ${styles.tablet}`}>
    <img alt="Tablet" className={styles.image} src={image} />

    <img alt="Website" className={styles.website} src={website} />
  </div>
);

export default Tablet;
