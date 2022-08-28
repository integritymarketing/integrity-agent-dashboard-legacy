import React from "react";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";

const MENU = ["stage", "reminders", "tags"];

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
            key={`${item - index}`}
          >
            {item}
          </Box>
        );
      })}
    </Box>
  );
}
