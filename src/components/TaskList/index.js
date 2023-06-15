import React, { useState, useEffect } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import DateRangeSort from "../DateRangeSort";
import styles from "./styles.module.scss";
import TabsCard from "components/TabsCard";
import UnLinkedCalls from "pages/dashbaord/UnLinkedCalls";
import UnlinkedPolicyList from "./UnlinkedPolicies";
import RemindersList from "./Reminders";
import RequestedCallback from "./RequestedCallbacks";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import clientsService from "services/clientsService";

const DEFAULT_TABS = [
  {
    policyStatus: "Requested Callbacks",
    policyCount: 3,
    colorCode: "#FBDEDE",
  },
  {
    policyStatus: "Reminders",
    policyCount: 34,
    colorCode: "#FEF8CB",
  },
  {
    policyStatus: "Unlinked Calls",
    policyCount: 4,
    colorCode: "#DEEBFB",
  },
  {
    policyStatus: "Unlinked Policies",
    policyCount: 8,
    colorCode: "#DEEBFB",
  },
];

export default function TaskList({ isMobile, npn }) {
  const [dRange] = usePreferences(0, "taskList_sort");
  const [index] = usePreferences(0, "taskList_widget");

  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);
  const [isError, setIsError] = useState(false);

  const [taskList, setTaskList] = useState([]);
  const [tabs, setTabs] = useState([]);

  const addToast = useToast();

  const selectedName =
    DEFAULT_TABS[statusIndex]?.policyStatus || "Requested Callbacks";

  useEffect(() => {
    const fetchEnrollPlans = async () => {
      try {
        const data = await clientsService.getTaskList(
          npn,
          dateRange,
          statusIndex
        );
        if (data?.taskSummmary?.length > 0) {
          setTaskList([...data.taskSummmary]);
        } else {
          setTaskList([]);
        }
      } catch (error) {
        setIsError(true);
        addToast({
          type: "error",
          message: "Failed to get Task List.",
          time: 10000,
        });
      }
    };
    fetchEnrollPlans();
  }, [addToast, statusIndex, dateRange, npn, selectedName]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const tabsData = await clientsService.getTaskListCount(npn, dateRange);
        setTabs(tabsData);
      } catch (error) {
        console.log("Error in fetch Task List count: ", error);
        addToast({
          type: "error",
          message: "Failed to get Task List Count.",
          time: 10000,
        });
      }
    };
    fetchCounts();
  }, [addToast, dateRange, npn]);

  const handleWidgetSelection = (index, policyCount) => {
    setStatusIndex(index);
  };

  // we can pass card info here and accordingly set the show to true as per card

  const renderList = () => {
    switch (selectedName) {
      case "Unlinked Calls":
        return <UnLinkedCalls isError={isError}  taskList={taskList} />;
      case "Unlinked Policies":
        return <UnlinkedPolicyList isError={isError} />;
      case "Reminders":
        return <RemindersList isError={isError} />;
      case "Requested Callbacks":
        return <RequestedCallback isError={isError} />
      default:
        return <UnlinkedPolicyList isError={isError} />;
    }
  };

  return (
    <ContactSectionCard
      title="Task List"
      className={styles.enrollmentPlanContainer}
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
        tabs={DEFAULT_TABS}
        preferencesKey={"taskList_widget"}
        statusIndex={statusIndex}
        setStatusIndex={setStatusIndex}
        apiTabs={tabs}
        handleWidgetSelection={handleWidgetSelection}
      />
      {renderList()}
    </ContactSectionCard>
  );
}
