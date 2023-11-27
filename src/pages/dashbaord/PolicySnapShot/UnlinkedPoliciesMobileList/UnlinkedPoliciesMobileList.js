import React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Link from "../Icons/relink";
import { convertUTCDateToLocalDate, convertToLocalDateTime } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import { TaskListCard } from "../../Tasklist/TaskListCardContainer";

import styles from "./UnlinkedPoliciesMobileList.module.scss";

export default function UnlinkedPolicyMobileList({ policyList }) {
    const navigate = useNavigate();

    const linkToContact = (item) => {
        const date = convertUTCDateToLocalDate(item?.taskDate);
        navigate(`/link-to-contact/${item?.id}/${item?.phoneNumber}/${item?.duration}/${date}`);
    };

    return (
        <>
            {[0, 1, 2, 3]?.map((item) => {
                return (
                    <TaskListCard multi={policyList?.length > 1} background="blue">
                        <Box className={styles.taskListInfo}>
                            <div className={styles.planName}> Humana HMO 2343</div>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>
                                    Policy ID:
                                    <span className={styles.taskSentDate}>
                                        {" "}
                                        {/* {convertToLocalDateTime(item?.taskDate).format("MM/DD/yyyy")} */}
                                    </span>
                                </div>
                                <div className={styles.dateTimeLabel}>
                                    Carrier:
                                    <span className={styles.taskSentDate}>
                                        {" "}
                                        {/* {convertToLocalDateTime(item?.taskDate).format("h:mm a")} */}
                                    </span>
                                </div>

                            </Box>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>
                                    Policy Holder

                                </div>
                                <div className={styles.taskSentDate}>
                                    {" "}
                                    {/* {convertToLocalDateTime(item?.taskDate).format("MM/DD/yyyy")} */}
                                </div>
                            </Box>
                        </Box>
                        <Box className={styles.taskListIcons}>
                            <div className={styles.taskListIcon} onClick={() => linkToContact(item)}>
                                <Link />
                            </div>

                            <div
                                className={`${styles.taskListIcon} ${styles.downloadIcon}`}>
                                <Link />
                            </div>

                        </Box>
                    </TaskListCard >
                );
            })}
        </>
    );
}
