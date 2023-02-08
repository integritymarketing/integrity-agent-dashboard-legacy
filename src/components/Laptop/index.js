import React from "react";
import image from "./image.png";
import website from "./images/website.png";

import styles from "./styles.module.scss";

const Laptop = () => (
  <div className={styles.laptop}>
    <img alt="Laptop" className={styles.image} src={image} />

    <img alt="Website" className={styles.website} src={website} />
  </div>
);

export default Laptop;
