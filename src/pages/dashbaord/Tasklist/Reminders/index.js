import React from "react";

import Box from "@mui/material/Box";

import { convertToLocalDateTime, formatDate } from "utils/dates";
import { getOverDue } from "utils/dates";
import { sortListByDate } from "utils/dates";

import styles from "./styles.module.scss";

import Reminder from "../Icons/reminder";
import { TaskListCard } from "../TaskListCardContainer";

export default function Reminders({ taskList, refreshData }) {
    const getDateTime = (dateString) => {
        const localDateTime = convertToLocalDateTime(dateString);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const completeReminder = (item) => {
        let payload = {
            reminderId: item?.id,
            leadId: item?.leadId,
            isComplete: true,
        };

        clientsService
            .updateReminder(payload)
            .then((data) => {
                showToast({
                    type: "success",
                    message: "Reminder successfully Updated.",
                    time: 3000,
                });
                refreshData(item?.id);
            })
            .catch((e) => {
                Sentry.captureException(e);
            });
    };

    const sortedList = sortListByDate(taskList, "taskDate", true);

    return (
        <>
            {sortedList?.map((item) => {
                const isReminderDue = getOverDue(item?.taskDate);

                return (
                    <TaskListCard multi={taskList?.length > 1} background="white">
                        <Box className={styles.taskListInfo}>
                            <Box>
                                <div className={styles.name}>{`${item?.firstName}   ${item?.lastName}`}</div>
                            </Box>
                            <Box className={styles.dateInfo}>
                                <Box className={`${styles.reminderIcon} ${isReminderDue ? styles.overDue : ""}`}>
                                    {isReminderDue ? <Reminder color="#FF1717" /> : <Reminder color="#4178FF" />}
                                </Box>
                                <Box marginTop={"10px"} marginLeft={"20px"}>
                                    <div className={styles.dateTimeLabel}>
                                        Due:
                                        <span className={styles.taskSentDate}>
                                            {" "}
                                            {getDateTime(item?.taskDate)?.date}
                                        </span>
                                    </div>
                                    <div className={styles.dateTimeLabel}>
                                        At:
                                        <span className={styles.taskSentDate}>
                                            {" "}
                                            {getDateTime(item?.taskDate)?.time}
                                        </span>
                                    </div>
                                </Box>
                            </Box>
                            <Box marginTop={"10px"}>
                                <div className={styles.reminderText} title={item?.remindersNotes}>
                                    {item?.remindersNotes}
                                </div>
                            </Box>
                        </Box>

                        <Box
                            className={`${styles.section}  
              }`}
                        >
                            <Box
                                className={`${styles.reminderIcon} ${styles.completeIcon}  `}
                                onClick={() => completeReminder(item)}
                            >
                                <Reminder color="#fff" />
                            </Box>
                        </Box>
                    </TaskListCard>
                );
            })}
        </>
    );
}
