import React, { useState, useEffect } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import styles from "./styles.module.scss";
import TabsCard from "components/TabsCard";
import UnLinkedCalls from "pages/dashbaord/UnLinkedCalls";
import RemindersList from "./Reminders";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import clientsService from "services/clientsService";
import ErrorState from "components/ErrorState";
import NoReminder from "images/no-reminder.svg";
import NoUnlinkedCalls from "images/no-unlinked-calls.svg";
import NoSOA48Hours from "images/no-soa-48-hours.svg";
import { Button } from "components/ui/Button";
import moment from "moment";
import WithLoader from "components/ui/WithLoader";
import Soa48HoursRule from "./Soa48HoursRule/Soa48HoursRule";
import PlanEnrollLeads from "./PlanEnrollLeads";
import { useNavigate } from "react-router-dom";
import { StageStatusProvider } from "contexts/stageStatus";
import { InfoModal } from "./InfoModal/InfoModal";
import Info from "components/icons/info-blue";
import { sortListByDate } from "utils/dates";

const DEFAULT_TABS = [
    {
        policyStatus: "PlanEnroll Leads",
        policyStatusColor: "#4178FF",
        name: "PlanEnrollLeads",
        value: 3,
    },
    {
        policyStatus: "SOA 48-hour Rule",
        policyStatusColor: "#4178FF",
        name: "Soa48HoursRule",
        value: 0,
    },
    {
        policyStatus: "Reminders",
        policyStatusColor: "#4178FF",
        name: "Reminders",
        value: 1,
    },
    {
        policyStatus: "Unlinked Calls",
        policyStatusColor: "#DEEBFB",
        name: "UnlinkedCalls",
        value: 2,
    },
];

const getLink = {
    Reminders: "MedicareCENTER-Reminders-Guide.pdf",
    "Unlinked Calls": "MedicareCENTER-Unlinked-Calls-Guide.pdf",
};

export default function TaskList({ isMobile, npn }) {
    const PAGESIZE = isMobile ? 3 : 5;
    const navigate = useNavigate();

    const [dRange] = usePreferences(0, "taskList_sort");
    const [index] = usePreferences(0, "taskList_widget");

    const [isLoading, setIsLoading] = useState(false);

    const [dateRange, setDateRange] = useState(dRange);
    const [statusIndex, setStatusIndex] = useState(index);
    const [isError, setIsError] = useState(false);
    const [fullList, setFullList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [tabs, setTabs] = useState(DEFAULT_TABS);
    const [page, setPage] = useState(1);
    const [totalPageSize, setTotalPageSize] = useState(1);
    const [showTaskListInfoModal, setShowTaskListInfoModal] = useState(false);
    const showToast = useToast();

    const selectedName = tabs[statusIndex]?.policyStatus || "PlanEnroll Leads";

    const showMore = page < totalPageSize;

    const widgetNumber = tabs[statusIndex]?.value;

    const fetchEnrollPlans = async () => {
        setIsLoading(true);
        setTotalPageSize(1);
        setPage(1);

        try {
            const data = await clientsService.getTaskList(npn, dateRange, widgetNumber);
            if (data?.taskSummmary?.length > 0) {
                const sortedTasks = data?.taskSummmary?.sort((a, b) =>
                    moment(b.taskDate, "MM/DD/YYYY HH:mm:ss").diff(moment(a.taskDate, "MM/DD/YYYY HH:mm:ss"))
                );
                setTotalPageSize(data.taskSummmary?.length / PAGESIZE);
                setFullList([...sortedTasks]);
            } else {
                setTaskList([]);
                setTotalPageSize(data?.pageResult?.totalPages);
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
        try {
            const tabsData = await clientsService.getTaskListCount(npn, dateRange);
            if (tabsData?.length > 0) {
                const updatedData = DEFAULT_TABS.map((tab, i) => {
                    const task = tabsData.find((t) => t.name === tab.name);
                    tab.policyCount = task?.count || 0;
                    tab.policyStatusColor = task?.color || "#4178FF";
                    return tab;
                });
                setTabs(updatedData);
            } else {
                setTabs(DEFAULT_TABS);
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to get Task List Count.",
                time: 10000,
            });
        }
    };

    useEffect(() => {

        if (statusIndex === 1) {
            const sortedTasks = sortListByDate(fullList, "signedDate", false);
            const list = sortedTasks?.filter((task, i) => i < page * PAGESIZE);
            setTaskList([...list]);
        } else {
            const list = fullList?.filter((task, i) => i < page * PAGESIZE);
            setTaskList([...list]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, fullList]);

    useEffect(() => {
        if (selectedName !== "PlanEnroll Leads") {
            fetchEnrollPlans();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast, widgetNumber, dateRange, npn, selectedName]);

    useEffect(() => {
        fetchCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast, dateRange, npn]);

    const refreshData = (id) => {
        fetchCounts();
        if (id) {
            const list = fullList?.filter((task) => task.id !== id);
            setFullList([...list]);
        }
    };


    const handleWidgetSelection = (index) => {
        setStatusIndex(index);

        const widgetName = tabs[index]?.name;
        const selectedWidgetCount = tabs[index]?.policyCount;

        if (isMobile && selectedWidgetCount > 0) {
            navigate(`/taskList-results-mobile-layout/${npn}/${widgetName}`);
        }
    };

    // we can pass card info here and accordingly set the show to true as per card

    const renderList = () => {
        switch (selectedName) {
            case "Unlinked Calls":
                return <UnLinkedCalls taskList={taskList} refreshData={refreshData} />;

            case "Reminders":
                return <RemindersList taskList={taskList} refreshData={refreshData} />;
            case "SOA 48-hour Rule":
                return <Soa48HoursRule isMobile={isMobile} taskList={taskList || []} refreshData={refreshData} />;

            case "PlanEnroll Leads":
                return <PlanEnrollLeads />;
            default:
                return <PlanEnrollLeads />;
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
            case "PlanEnroll Leads": {
                return "There are no planenroll leads for you at this time.";
            }
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
                return NoSOA48Hours;
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

    const selectedWidgetCount = tabs[statusIndex]?.policyCount;

    return (
        <>
            <ContactSectionCard
                title="Task List"
                className={styles.enrollmentPlanContainer_dashboard}
                isDashboard={true}
                infoIcon={
                    <div onClick={() => setShowTaskListInfoModal(true)} className={styles.infoIcon}>
                        <Info />
                    </div>
                }
                actions={
                    <DateRangeSort
                        isMobile={isMobile}
                        preferencesKey={"taskList_sort"}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                    />
                }
                preferencesKey={"taskList_collapse"}
            >
                <TabsCard
                    tabs={tabs}
                    preferencesKey={"taskList_widget"}
                    statusIndex={statusIndex}
                    handleWidgetSelection={handleWidgetSelection}
                    apiTabs={tabs}
                    isMobile={isMobile}
                />

                {isError || selectedWidgetCount === 0 ? (
                    <ErrorState
                        isError={isError}
                        emptyList={selectedWidgetCount === 0}
                        heading={getErrorHeading(selectedName)}
                        content={getMoreInfo(selectedName)}
                        icon={getIcon(selectedName)}
                        link={getLink[selectedName]}
                    />
                ) : (
                    <>
                        {selectedName !== "PlanEnroll Leads" && (
                            <WithLoader isLoading={isLoading}>
                                <>
                                    {!isMobile && (
                                        <>
                                            {renderList()}
                                            {showMore && (
                                                <div className="jumpList-card">
                                                    <Button
                                                        type="tertiary"
                                                        onClick={() => setPage(page + 1)}
                                                        label="Show More"
                                                        className="jumpList-btn"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            </WithLoader>
                        )}
                        {selectedName === "PlanEnroll Leads" && !isMobile && (
                            <StageStatusProvider>
                                <PlanEnrollLeads dateRange={dateRange} />
                            </StageStatusProvider>
                        )}
                    </>
                )}
            </ContactSectionCard>
            {showTaskListInfoModal &&
                <InfoModal open={showTaskListInfoModal} onClose={() => setShowTaskListInfoModal(false)} isMobile={isMobile} />
            }
        </>
    );
}
