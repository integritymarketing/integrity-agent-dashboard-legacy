import React from "react";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";

export const TaskListCard = ({ background, multi, children }) => {
  return (
    <Box
      className={`${styles.taskListCard} ${styles[background]}  ${
        !multi ? styles.singleCardBorder : ""
      }`}
    >
      {children}
    </Box>
  );
};
