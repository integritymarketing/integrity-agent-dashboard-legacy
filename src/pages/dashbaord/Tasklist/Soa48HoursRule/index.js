import React from "react";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";
import OpenIcon from "components/icons/open";
import { formatDate, convertToLocalDateTime, getHoursDiffBetweenTwoDays } from "utils/dates";
import { Button } from "components/ui/Button";
import { TaskListCard,  } from "../TaskListCardContainer";

import styles from "./styles.module.scss";

const Soa48HoursRule = ({ taskList, refreshData }) => {
    const navigate = useNavigate();

    const getDateTime = (dateString) => {
        const localDateTime = convertToLocalDateTime(dateString);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const navigateToConfirmSOA = (item) => {
        navigate({
            pathname: `/contact/${item?.leadId}/soa-confirm/${item?.soaLinkCode}`,
            state: { from: "Dashboard" },
        });
        refreshData(item?.id);
    };

    const isEarlierThanCurrentDate = (contactAfterDate, signedDate) =>
        getHoursDiffBetweenTwoDays(contactAfterDate, new Date()) < 0;

    const getName = (item) => {
        if (!item) return "";
        const { firstName = "", middleName = "", lastName = "" } = item;
        const formattedName = [firstName, middleName, lastName].filter(Boolean);
        return formattedName.join(" ");
    };

    const navigateToContacts = (item) => {
        navigate("/contact/" + item.leadId);
    };

    return (
        <>
            {taskList?.map((item) => {
                return (
                    <TaskListCard multi={taskList?.length > 1} background="white">
                        <Box className={styles.taskListInfo}>
                            <Box>
                                <div className={styles.taskSentDate}>
                                    SOA sent {getDateTime(item?.sentDate)?.date} to
                                </div>
                                <div className={styles.name} onClick={() => navigateToContacts(item)}>
                                    {getName(item)}
                                </div>
                                <div className={styles.mobile}>{item ? item?.phoneNumber || item?.sentTo : ""}</div>
                            </Box>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>
                                    Date Signed:
                                    <span className={styles.taskSentDate}> {getDateTime(item?.signedDate)?.date}</span>
                                </div>
                                <div className={styles.dateTimeLabel}>
                                    Time Signed:
                                    <span className={styles.taskSentDate}> {getDateTime(item?.signedDate)?.time}</span>
                                </div>
                            </Box>
                            <Box marginTop={"10px"}>
                                <div className={styles.contactAfterLabel}>Contact After</div>
                                <div className={styles.fromToDates}>
                                    <span className={styles.dateValue}>{getDateTime(item?.contactAfterDate).date}</span>
                                    <span className={styles.atText}>at</span>
                                    <span className={styles.dateValue}>{getDateTime(item?.contactAfterDate).time}</span>
                                </div>
                            </Box>
                        </Box>
                        <Box className={`${styles.section} ${styles.action} ${styles.mobileIcon}`}>
                            <Button
                                className={`${styles.completeBtn} ${
                                    isEarlierThanCurrentDate(item?.contactAfterDate) ? styles.disabled : ""
                                }`}
                                label=""
                                onClick={() => navigateToConfirmSOA(item)}
                                type="primary"
                                icon={<OpenIcon />}
                                iconPosition="right"
                            />
                        </Box>
                    </TaskListCard>
                );
            })}
        </>
    );
};

export default Soa48HoursRule;
