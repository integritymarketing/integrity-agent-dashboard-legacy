import React, { useState } from "react";

import { Box } from "@mui/system";

import ArrowDownBlue from "components/icons/version-2/ArrowDownBlue";

import styles from "./Accordion.module.scss";

import { Info } from "../../Icons";

const Accordion = function ({ label, items }) {
    const [open, setOpen] = useState(true);

    return (
        <Box className={styles.container}>
            <Box className={styles.labelContainer}>
                <Box
                    className={`${styles.chevronIcon} ${!open && styles.chevronIconRotate}`}
                    onClick={() => setOpen((value) => !value)}
                >
                    <ArrowDownBlue />
                </Box>
                <Box onClick={() => setOpen((value) => !value)}>{label}</Box>
                <Box className={styles.infoIcon}>
                    <Info />
                </Box>
            </Box>
            {open && (
                <Box className={styles.itemsContainer} onClick={() => setOpen((value) => !value)}>
                    {items.map((item) => (
                        <Box className={styles.itemContainer} key={item.label}>
                            <Box className={styles.itemLabel}>{item.label}</Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Accordion;
