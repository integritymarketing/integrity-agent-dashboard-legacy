import React from "react";
import image from "./business.png";

import styles from "./styles.module.scss";

const Tablet = ({ className = "" }) => (
    <div className={`${className} ${styles.tablet}`}>
        <img alt="Tablet" className={styles.image} src={image} />
    </div>
);

export default Tablet;
