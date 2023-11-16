import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "utils/phones";
import { formatDate, sortListByDate, convertToLocalDateTime } from "utils/dates";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import WithLoader from "components/ui/WithLoader";
import StageSelect from "pages/contacts/contactRecordInfo/StageSelect";
import Box from "@mui/material/Box";
import { TaskListCard } from "../TaskListCardContainer";

import clientsService from "services/clientsService";

import styles from "./styles.module.scss";

const PlanEnrollCard = ({ callData, refreshData, multi }) => {
    const navigate = useNavigate();

    const leadFullName = `${callData?.firstName} ${callData?.lastName}`;

    const phonesData = callData?.phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = phonesData?.[0]?.leadPhone || null;
    const leadEmail = callData?.emails.length > 0 ? callData?.emails?.[0]?.leadEmail : null;

    const isPrimary = callData?.contactPreferences?.primary || null;

    const getDateTime = () => {
        const localDateTime = convertToLocalDateTime(callData?.createDate);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    const primaryContact =
        isPrimary === "email" && leadEmail ? leadEmail : leadPhone ? formatPhoneNumber(leadPhone) : leadEmail;

    const handleContactClick = () => {
        if (leadEmail && isPrimary === "email") {
            window.location.href = `mailto:${leadEmail}`;
        } else if (leadPhone) {
            window.location.href = `tel:${leadPhone}`;
        }
    }

    return (
        <TaskListCard multi={multi} background="white">
            <Box className={styles.taskListInfo}>
                <Box>
                    <div className={styles.name}>{leadFullName}</div>
                    <div className={styles.mobile} onClick={handleContactClick}>{primaryContact || ""}</div>
                </Box>
                <Box className={styles.dateInfo}>
                    <div className={styles.planDateLabel}>Date Requested</div>
                    <div className={styles.planDate}>
                        {" "}
                        {getDateTime()?.date} <span className={styles.planDateSpan}>at</span> {getDateTime()?.time}{" "}
                    </div>
                </Box>
                <Box className={styles.stageInfo}>
                    <div className={styles.planStage}>
                        <div className={styles.planStageText}>Stage</div>
                        <div className={styles.planStageSelect}>
                            <StageSelect
                                initialValue={callData?.statusName}
                                originalData={callData}
                                refreshData={() => refreshData(callData?.leadsId)}
                            />
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <Button
                            icon={<Person color="#ffffff" />}
                            label={"View Contact"}
                            className={styles.viewContactButton}
                            onClick={() => navigate(`/contact/${callData?.leadsId}`)}
                            type="tertiary"
                            iconPosition="right"
                        />
                    </div>
                </Box>
            </Box>
        </TaskListCard>
    );
};

const PlanEnrollLeads = ({ dateRange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [planEnrollData, setPlanEnrollData] = useState([]);

    const showToast = useToast();

    useEffect(() => {
        getPlanEnrollData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    const getPlanEnrollData = async () => {
        setIsLoading(true);

        const stage = [12];

        try {
            const response = await clientsService.getDashboardData(
                null,
                null,
                null,
                null,
                true,
                null,
                null,
                null,
                stage,
                null,
                dateRange,
                "planenroll"
            );
            if (response?.result?.length > 0) {
                setPlanEnrollData([...response.result]);
            } else {
                setPlanEnrollData([]);
            }
        } catch (err) {
            Sentry.captureException(err);
            showToast({
                type: "error",
                message: "Failed to load data",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = (id) => {
        if (id) {
            const list = planEnrollData?.filter((data) => data.leadsId !== id);
            setPlanEnrollData([...list]);
        }
    };

    const sortedTasks = sortListByDate(planEnrollData, "createDate", false);


    return (
        <WithLoader isLoading={isLoading}>
            {sortedTasks?.length > 0 &&
                sortedTasks?.map((data) => {
                    return <PlanEnrollCard callData={data} refreshData={refreshData} multi={sortedTasks?.length > 1} />;
                })}
        </WithLoader>
    );
};

export default PlanEnrollLeads;
