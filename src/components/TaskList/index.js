import React, { useState, useEffect } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import styles from "./styles.module.scss";
import TabsCard from "components/TabsCard";
import UnLinkedCalls from "pages/dashbaord/UnLinkedCalls";
import UnlinkedPolicyList from "./UnlinkedPolicies";
import RemindersList from "./Reminders";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import clientsService from "services/clientsService";
import ErrorState from "components/ErrorState";
import NoReminder from "images/no-reminder.svg";
import NoUnlinkedPolicy from "images/no-unlinked-policies.svg";
import NoRequestedCallback from "images/no-requested-callback.svg";
import NoUnlinkedCalls from "images/no-unlinked-calls.svg";
import { Button } from "components/ui/Button";
import moment from "moment";
import WithLoader from "components/ui/WithLoader";
import Soa48HoursRule from "./Soa48HoursRule/Soa48HoursRule";

const DEFAULT_TABS = [
  {
    policyStatus: "SOA 48-hour Rule",
    policyStatusColor: "#4178FF",
    name: "soa48HoursRule",
    value: 0,
  },
  {
    policyStatus: "Reminders",
    policyStatusColor: "#4178FF",
    name: "reminders",
    value: 1,
  },
  {
    policyStatus: "Unlinked Calls",
    policyStatusColor: "#DEEBFB",
    name: "unlinkedCalls",
    value: 2,
  },
  {
    policyStatus: "Unlinked Policies",
    policyStatusColor: "#DEEBFB",
    name: "unLinkedPolicies",
    value: 3,
  },
];

const getIcon = {
  "Requested Callbacks": NoRequestedCallback,
  Reminders: NoReminder,
  "Unlinked Calls": NoUnlinkedCalls,
  "Unlinked Policies": NoUnlinkedPolicy,
};

const getMoreInfo = {
  "Requested Callbacks":
    "about how you can receive leads through consumer callback requests.",
  Reminders: "about how you can create reminders.",
  "Unlinked Calls": "about unlinked calls.",
  "Unlinked Policies": "about unlinked policies.",
  "SOA 48-hour rule": "about SOA 48-hour rule.",
};

const getLink = {
  "Requested Callbacks": "MedicareCENTER-Requested-Callbacks-Guide.pdf",
  Reminders: "MedicareCENTER-Reminders-Guide.pdf",
  "Unlinked Calls": "MedicareCENTER-Unlinked-Calls-Guide.pdf",
  "Unlinked Policies": "MedicareCENTER-Unlinked-Policies-Guide.pdf",
};

export default function TaskList({ isMobile, npn }) {
  const PAGESIZE = isMobile ? 3 : 5;

  const [dRange] = usePreferences(0, "taskList_sort");
  const [index] = usePreferences(1, "taskList_widget");

  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);
  const [isError, setIsError] = useState(false);
  const [fullList, setFullList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(1);
  const addToast = useToast();

  const selectedName =
    DEFAULT_TABS.find((tab) => tab.value === statusIndex)?.policyStatus ||
    "SOA 48-hour rule";

  const showMore = page < totalPageSize;

  const fetchEnrollPlans = async () => {
    setIsLoading(true);
    setTotalPageSize(1);
    setPage(1);
    try {
      const data = await clientsService.getTaskList(
        npn,
        dateRange,
        statusIndex
      );
      if (data?.taskSummmary?.length > 0) {
        const sortedTasks = data?.taskSummmary?.sort((a, b) =>
          moment(b.taskDate, "MM/DD/YYYY HH:mm:ss").diff(
            moment(a.taskDate, "MM/DD/YYYY HH:mm:ss")
          )
        );
        setTotalPageSize(data.taskSummmary?.length / PAGESIZE);
        setFullList([...sortedTasks]);
      } else {
        setTaskList([]);
        setTotalPageSize(data?.pageResult?.totalPages);
      }
    } catch (error) {
      setIsError(true);
      addToast({
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
      const data = DEFAULT_TABS.map((tab, i) => {
        const task = tabsData[tab.name];
        tab.policyCount = task?.count || task || 0;
        return tab;
      });
      setTabs([...data]);
    } catch (error) {
      console.log("Error in fetch Task List count: ", error);
      addToast({
        type: "error",
        message: "Failed to get Task List Count.",
        time: 10000,
      });
    }
  };

  useEffect(() => {
    if (statusIndex === 0) {
      let sortedList = fullList.sort(
        (a, b) => new Date(b.signedDate) - new Date(a.signedDate)
      );
      const list = sortedList?.filter((task, i) => i < page * PAGESIZE);
      setTaskList([...list]);
    } else if (statusIndex === 1) {
      let sortedList = fullList?.sort((a, b) =>
        moment(b.taskList, "MM/DD/YYYY HH:mm:ss").diff(
          moment(a.taskList, "MM/DD/YYYY HH:mm:ss")
        )
      );
      const list = sortedList?.filter((task, i) => i < page * PAGESIZE);
      setTaskList([...list]);
    } else {
      const list = fullList?.filter((task, i) => i < page * PAGESIZE);
      setTaskList([...list]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fullList]);

  useEffect(() => {
    fetchEnrollPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, statusIndex, dateRange, npn, selectedName]);

  useEffect(() => {
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, dateRange, npn]);

  const refreshData = (id) => {
    fetchCounts();
    if (id) {
      const list = fullList?.filter((task) => task.id !== id);
      setFullList([...list]);
    }
  };

  // we can pass card info here and accordingly set the show to true as per card

  const renderList = () => {
    switch (selectedName) {
      case "Unlinked Calls":
        return <UnLinkedCalls taskList={taskList} refreshData={refreshData} />;
      case "Unlinked Policies":
        return (
          <UnlinkedPolicyList
            taskList={taskList}
            npn={npn}
            refreshData={refreshData}
          />
        );
      case "Reminders":
        return <RemindersList taskList={taskList} refreshData={refreshData} />;
      case "SOA 48-hour Rule":
        return (
          <Soa48HoursRule
            isMobile={isMobile}
            taskList={taskList || []}
            refreshData={refreshData}
          />
        );
      default:
        return (
          <UnlinkedPolicyList
            taskList={taskList}
            npn={npn}
            refreshData={refreshData}
          />
        );
    }
  };

  const getErrorHeading = () => {
    switch (selectedName) {
      case "Reminders": {
        return "There are no reminders to display at this time.";
      }
      case "SOA 48-hour Rule": {
        return "You do not have any SOA 48-Hour Rule tasks for this date range.";
      }
      default:
        return `There are no ${selectedName?.toLowerCase()} at this time.`;
    }
  };

  return (
    <ContactSectionCard
      title="Task List"
      className={styles.enrollmentPlanContainer_dashboard}
      isDashboard={true}
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
        handleWidgetSelection={setStatusIndex}
        apiTabs={tabs}
      />
      <WithLoader isLoading={isLoading}>
        {isError || taskList?.length === 0 ? (
          <ErrorState
            isError={isError}
            emptyList={taskList?.length > 0 ? false : true}
            heading={getErrorHeading()}
            content={getMoreInfo[selectedName]}
            icon={getIcon[selectedName]}
            link={getLink[selectedName]}
          />
        ) : (
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
      </WithLoader>
    </ContactSectionCard>
  );
}
