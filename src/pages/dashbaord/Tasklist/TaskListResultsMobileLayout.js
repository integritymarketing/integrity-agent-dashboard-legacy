import React, { useEffect, useState, } from "react";
import Box from "@mui/material/Box";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Media from "react-media";
import GlobalNav from "partials/global-nav-v2";
import Footer from "components/Footer";
import WithLoader from "components/ui/WithLoader";
import DateRangeSort from "components/DateRangeSort";

import ErrorState from "components/ErrorState";
import NoReminder from "images/no-reminder.svg";
import NoUnlinkedCalls from "images/no-unlinked-calls.svg";
import NoSOA48Hours from "images/no-soa-48-hours.svg";
import PlanEnroll from "components/icons/planEnroll";
import PlanEnrollBig from "images/enroll.svg";

import UnLinkedCalls from "./UnlinkedCalls";
import RemindersList from "./Reminders";
import PlanEnrollLeads from "./PlanEnrollLeads";
import Soa48HoursRule from "./Soa48HoursRule";
import clientsService from "services/clientsService";
import { StageStatusProvider } from "contexts/stageStatus";
import { TaskListCardContainer } from "./TaskListCardContainer";
import usePreferences from "hooks/usePreferences";

import moment from "moment";

import styles from "./TaskListMobileLayout.module.scss";

const DEFAULT_TABS = [
    {
        policyStatus: "Reminders",
        name: "Reminders",
        value: 1,
    },

    {
        policyStatus: "Unlinked Calls",
        name: "UnlinkedCalls",
        value: 2,
    },
    {
        policyStatus: "SOA 48-hour Rule",
        name: "Soa48HoursRule",
        value: 0,
    },
    {
        policyStatus: "PlanEnroll Leads",
        name: "PlanEnrollLeads",
        value: 3,
    },
];

const getLink = {
    Reminders: "MedicareCENTER-Reminders-Guide.pdf",
    "Unlinked Calls": "MedicareCENTER-Unlinked-Calls-Guide.pdf",
};

export default function TaskListMobileLayout() {
    const { npn, widget } = useParams();

    const [dRange] = usePreferences(0, "taskList_sort");

    const [dateRange, setDateRange] = useState(dRange);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isError, setIsError] = useState(false);

    const [taskList, setTaskList] = useState([]);

    const WIDGET_NAME = DEFAULT_TABS.find((tab) => tab.name === widget)?.policyStatus;

    const WIDGET_INDEX = DEFAULT_TABS.find((tab) => tab.name === widget)?.value;

    const [widgetInfo, setWidgetInfo] = useState({
        count: 0,
        color: "",
    });

    useEffect(() => {
        if (WIDGET_NAME !== "PlanEnroll Leads") {
            fetchEnrollPlans();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange, npn, WIDGET_INDEX]);

    const fetchEnrollPlans = async () => {
        setIsLoading(true);
        try {
            const data = await clientsService.getTaskList(npn, dateRange, WIDGET_INDEX);
            if (data?.taskSummmary?.length > 0) {
                const sortedTasks = data?.taskSummmary?.sort((a, b) =>
                    moment(b.taskDate, "MM/DD/YYYY HH:mm:ss").diff(moment(a.taskDate, "MM/DD/YYYY HH:mm:ss"))
                );
                setTaskList([...sortedTasks]);
            } else {
                setTaskList([]);
            }
        } catch (error) {
            setIsError(true);
            showToast({
                type: "error",
                message: "Failed to get Task List.",
                time: 10000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCounts = async () => {
        setIsLoading(true);
        try {
            const tabsData = await clientsService.getTaskListCount(npn, dateRange);
            if (tabsData?.length > 0) {
                const data = tabsData.find((tab) => tab.name === widget);
                setWidgetInfo(data);
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to get Task List Count.",
                time: 10000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange, npn]);

    const refreshData = (id) => {
        fetchCounts();
        if (id) {
            const list = fullList?.filter((task) => task.id !== id);
            setFullList([...list]);
        }
    };

    // we can pass card info here and accordingly set the show to true as per card

    const renderList = () => {
        switch (WIDGET_NAME) {
            case "Unlinked Calls":
                return <UnLinkedCalls taskList={taskList} refreshData={refreshData} />;
            case "Reminders":
                return <RemindersList taskList={taskList} refreshData={refreshData} />;
            case "SOA 48-hour Rule":
                return <Soa48HoursRule isMobile={isMobile} taskList={taskList || []} refreshData={refreshData} />;
            default:
                return <Soa48HoursRule isMobile={isMobile} taskList={taskList || []} refreshData={refreshData} />;
        }
    };

    const getErrorHeading = (selectedName) => {
        switch (selectedName) {
            case "Reminders": {
                return "There are no reminders to display at this time.";
            }
            case "SOA 48-hour Rule": {
                return "There are no incomplete SOAs being tracked for you at this time.";
            }
            case "PlanEnroll Leads":
                return "There are no PlanEnroll Leads available for the selected date range."
            default:
                return `There are no ${selectedName?.toLowerCase()} at this time.`;
        }
    };

    const getIcon = (selectedName) => {
        switch (selectedName) {
            case "Reminders":
                return NoReminder;
            case "Unlinked Calls":
                return NoUnlinkedCalls;
            case "PlanEnroll Leads":
                return PlanEnrollBig;
            case "SOA 48-hour Rule":
                return NoSOA48Hours;
            default:
                return null;
        }
    };

    const getMoreInfo = (selectedName) => {
        switch (selectedName) {
            case "Reminders": {
                return "about how you can create reminders.";
            }
            case "Unlinked Calls": {
                return "about unlinked calls.";
            }

            case "SOA 48-hour Rule": {
                return "To track an SOA sent through Contact Management, make sure you check the “Track SOA” box on the Send SOA screen. Tracked SOAs will be displayed here once they’re signed by your Contacts. When you complete tracked SOAs, they’ll be removed from this view but will still be available in the Contact records.";
            }
            default:
        }
    };

    return (
        <Box className={styles.taskListMobileContainer}>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Helmet>
                <title>MedicareCENTER - Dashboard</title>
            </Helmet>
            <GlobalNav page="taskListMobileLayout" title="Task List" />

            <Box className={styles.mobileWidget}>
                <Box className={styles.taskListColor} style={{ backgroundColor: widgetInfo?.color }}></Box>
                <Box className={styles.taskListHeader}>
                    <div className={styles.taskListTitle}>
                        {WIDGET_NAME === "PlanEnroll Leads" && (
                            <span className={styles.planEnrollIcon}>
                                <PlanEnroll />
                            </span>
                        )}
                        {WIDGET_NAME}
                    </div>
                    <div className={styles.taskListCount}>{`(${widgetInfo?.count})`}</div>
                </Box>
            </Box>
            <Box className={styles.mobileDateRange}>
                <DateRangeSort
                    preferencesKey={"taskList_sort"}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    page="taskListMobileLayout"
                />
            </Box>
            <TaskListCardContainer>
                {!isLoading && (isError || widgetInfo?.count === 0) ? (
                    <ErrorState
                        isError={isError}
                        emptyList={widgetInfo?.count === 0}
                        heading={getErrorHeading(WIDGET_NAME)}
                        content={getMoreInfo(WIDGET_NAME)}
                        icon={getIcon(WIDGET_NAME)}
                        link={getLink[WIDGET_NAME]}
                        iconPosition="left"
                    />
                ) : (
                    <>
                        {WIDGET_NAME !== "PlanEnroll Leads" && (
                            <WithLoader isLoading={isLoading}>{renderList()}</WithLoader>
                        )}
                        {WIDGET_NAME === "PlanEnroll Leads" && (
                            <StageStatusProvider>
                                <PlanEnrollLeads dateRange={dateRange} />
                            </StageStatusProvider>
                        )}
                    </>
                )}
            </TaskListCardContainer>

            <Footer />
        </Box>
    );
}
