import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import Person from "components/icons/personLatest";
import { useNavigate } from "react-router-dom";
import { getMMDDYY } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";
import { formatDate, convertToLocalDateTime } from "utils/dates";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import WithLoader from "components/ui/WithLoader";
import StageSelect from "pages/contacts/contactRecordInfo/StageSelect";
import Box from "@mui/material/Box";
import { TaskListCard, TaskListCardContainer } from "../TaskListCardContainer";

import clientsService from "services/clientsService";

import styles from "./styles.module.scss";

const PlanEnrollCard = ({ callData, refreshData, multi }) => {
    const navigate = useNavigate();

    const leadFullName = `${callData?.firstName} ${callData?.lastName}`;

    const phonesData = callData?.phones?.filter((phone) => {
        return phone?.leadPhone && phone?.leadPhone !== "" ? phone : null;
    });

    const leadPhone = phonesData?.[0]?.leadPhone || null;

    const requestedDate = getMMDDYY(callData?.createDate);

    const getDateTime = () => {
        const localDateTime = convertToLocalDateTime(requestedDate);
        const date = formatDate(localDateTime, "MM/dd/yyyy");
        const time = formatDate(localDateTime, "h:mm a").toLowerCase();
        return { date, time };
    };

    return (
        <TaskListCard multi={multi} background="white">
            <Box className={styles.taskListInfo}>
                <Box>
                    <div className={styles.name}>{leadFullName}</div>
                    <div className={styles.mobile}>{formatPhoneNumber(leadPhone)}</div>
                </Box>
                <Box className={styles.dateInfo}>
                    <div className={styles.planDateLabel}>Date Requested:</div>
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

    return (
        <WithLoader isLoading={isLoading}>
            {planEnrollData?.length > 0 &&
                planEnrollData?.map((data) => {
                    return (
                        <PlanEnrollCard callData={data} refreshData={refreshData} multi={planEnrollData?.length > 1} />
                    );
                })}
        </WithLoader>
    );
};

export default PlanEnrollLeads;
