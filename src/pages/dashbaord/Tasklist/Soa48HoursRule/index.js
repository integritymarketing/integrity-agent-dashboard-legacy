import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import { convertToLocalDateTime, formatDate, getHoursDiffBetweenTwoDays, sortListByDate } from "utils/dates";

import OpenIcon from "components/icons/open";
import { Button } from "components/ui/Button";

import styles from "./styles.module.scss";

import { TaskListCard } from "../TaskListCardContainer";

const Soa48HoursRule = ({ taskList, refreshData }) => {
    const navigate = useNavigate();

    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();

    const getDateTime = (dateString) => {
        const localDateTime = convertToLocalDateTime(dateString);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const navigateToConfirmSOA = (item) => {
        setLinkCode(item?.soaLinkCode);
        setSelectedTab("complete-scope-of-appointment");
        navigate(`/contact/${item?.leadId}/complete-scope-of-appointment`);
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

    const sortedTasks = sortListByDate(taskList, "signedDate", true);

    return (
        <>
            {sortedTasks?.map((item) => {
                return (
                    <TaskListCard multi={taskList?.length > 1} background="white">
                        <Box className={styles.taskListInfo}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box width={"80%"}>
                                    <div className={styles.taskSentDate}>
                                        SOA sent {getDateTime(item?.sentDate)?.date} to
                                    </div>
                                    <div className={styles.name} onClick={() => navigateToContacts(item)}>
                                        {getName(item)}
                                    </div>
                                    <div className={styles.mobile}>{item ? item?.phoneNumber || item?.sentTo : ""}</div>
                                </Box>
                                <div className={`${styles.mobileIcon}`}>
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
                                </div>
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
                    </TaskListCard>
                );
            })}
        </>
    );
};

export default Soa48HoursRule;
