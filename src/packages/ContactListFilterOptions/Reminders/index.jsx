import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import styles from "./styles.module.scss";
import CheckMark from "../CheckMarkIcon/CheckMark";
import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";
import Reminder_Add from "images/Reminder_Add.svg";

const REMINDERS = [
  {
    name: "Active Reminders",
    icon: ReminderIcon,
  },
  {
    name: "Overdue Reminders",
    icon: Reminder_Overdue,
  },
  {
    name: "No Reminders Added",
    icon: Reminder_Add,
  },
];

export default function Reminders({ reminder, setReminder }) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 3,
        marginTop: "18px",
      }}
    >
      {REMINDERS.map((row, i) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              cursor: "pointer",
              justifyContent: "space-between",
              borderBottom: "1px solid lightgrey",
              "&:last-child": { borderBottom: "unset" },
            }}
            onClick={() => {
              if (row.name === reminder) {
                setReminder("");
              } else setReminder(row.name);
            }}
            key={row.name}
          >
            <div style={{ display: "flex", padding: "0 8px" }}>
              <img
                className={styles.reminderIcon}
                src={row.icon}
                alt={row.name}
              />

              <Typography
                sx={{ color: "#434A51", fontSize: "16px", marginLeft: "18px" }}
                variant={"subtitle1"}
              >
                {row.name}
              </Typography>
            </div>
            <CheckMark show={row.name === reminder} />
          </Box>
        );
      })}
    </Box>
  );
}
