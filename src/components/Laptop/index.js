import React from "react";
import image from "./serveClientImage.png";

import styles from "./styles.module.scss";

const Laptop = () => (
    <div className={styles.laptop}>
        <img alt="Website" className={styles.website} src={image} />
    </div>
);

export default Laptop;
