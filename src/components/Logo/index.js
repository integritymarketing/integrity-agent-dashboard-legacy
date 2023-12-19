import React from "react";
import { Link } from "react-router-dom";

import { altText } from "./constants";

import styles from "./styles.module.scss";

const Logo = ({ className = "", color = "blue" }) => {
    const image = `/images/logo-${color}.svg`;

    return (
        <Link className={styles.logo} to="/">
            <img alt={altText} className={`${className} ${styles.image}`} src={image} />
        </Link>
    );
};

export default Logo;
