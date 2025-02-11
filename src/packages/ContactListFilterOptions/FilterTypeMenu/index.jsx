import React from "react";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";

const MENU = ["Stage", "Reminders", "Tags"];

export default function FilterTypeMenu({ filterType, setFilterType }) {
  return (
    <Box className={styles.filterMenu}>
      {MENU.map((item, index) => {
        return (
          <Box
            className={`${styles.item} ${
              filterType === item ? styles.bgSelect : ""
            }`}
            onClick={() => setFilterType(item)}
            key={`${item}`}
          >
            {item}
          </Box>
        );
      })}
    </Box>
  );
}
