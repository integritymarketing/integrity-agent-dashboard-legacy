import React from "react";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";

export const TaskListCardContainer = ({ children }) => {
  return <Box className={styles.taskListContainer}>{children}</Box>;
};
