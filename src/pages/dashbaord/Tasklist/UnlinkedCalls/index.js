import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Link from "../Icons/relink";
import Download from "../Icons/download";
import InboundCall from "../Icons/incomingCall";
import { convertUTCDateToLocalDate, convertToLocalDateTime } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import { TaskListCard } from "../TaskListCardContainer";

import styles from "./styles.module.scss";

function TaskListMobileLayout({ taskList }) {
    const navigate = useNavigate();

    const linkToContact = (item) => {
        const date = convertUTCDateToLocalDate(item?.taskDate);
        navigate(`/link-to-contact/${item?.id}/${item?.phoneNumber}/${item?.duration}/${date}`);
    };

    return (
        <>
            {taskList?.map((item, index) => {
                return (
                    <TaskListCard key={index} multi={taskList?.length > 1} background="blue">
                        <Box className={styles.taskListInfo}>
                            <Box marginTop={"10px"}>
                                <div className={styles.dateTimeLabel}>
                                    Date:
                                    <span className={styles.taskSentDate}>
                                        {" "}
                                        {convertToLocalDateTime(item?.taskDate).format("MM/DD/yyyy")}
                                    </span>
                                </div>
                                <div className={styles.dateTimeLabel}>
                                    Time:
                                    <span className={styles.taskSentDate}>
                                        {" "}
                                        {convertToLocalDateTime(item?.taskDate).format("h:mm a")}
                                    </span>
                                </div>
                                <div className={styles.dateTimeLabel}>
                                    Duration:
                                    <span className={styles.taskSentDate}> {item?.duration}</span>
                                </div>
                            </Box>
                            <Box className={styles.callInfo} marginTop={"10px"}>
                                <div className={styles.callIcon}>
                                    <InboundCall />
                                </div>
                                <div className={styles.callName}>Inbound Call</div>
                                <div className={styles.fromText}>from</div>
                                <div className={styles.mobile}>{formatPhoneNumber(item?.phoneNumber, true)}</div>
                            </Box>
                        </Box>
                        <Box className={styles.taskListIcons}>
                            <div className={styles.taskListIcon} onClick={() => linkToContact(item)}>
                                <Link />
                            </div>

                            <div
                                className={`${styles.taskListIcon} ${styles.downloadIcon}`}
                                onClick={() => {
                                    const recordingUrl = item?.recordingUrl;
                                    const link = document.createElement("a");
                                    link.href = recordingUrl;
                                    link.download = "call_recording.mp3";
                                    link.click();
                                }}
                            >
                                <Download />
                            </div>
                        </Box>
                    </TaskListCard>
                );
            })}
        </>
    );
}

TaskListMobileLayout.propTypes = {
    taskList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            taskDate: PropTypes.string.isRequired,
            phoneNumber: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired,
            recordingUrl: PropTypes.string,
        })
    ).isRequired,
};

export default TaskListMobileLayout;
