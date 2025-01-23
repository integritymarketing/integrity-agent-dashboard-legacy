import React, { forwardRef } from "react";

import Laptop from "components/Laptop";
import Mobile from "components/Mobile";

import styles from "./styles.module.scss";

const Devices = forwardRef(({ className = "" }, ref) => {
    return (
        <div className={`${className} ${styles.devices}`} ref={ref}>
            <Laptop />
        </div>
    );
});

export default Devices;
