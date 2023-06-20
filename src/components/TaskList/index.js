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
import ErrorState from "components/ErrorState";
import NoReminder from "images/no-reminder.svg";
import NoUnlinkedPolicy from "images/no-unlinked-policies.svg";
import NoRequestedCallback from "images/no-requested-callback.svg";
import NoUnlinkedCalls from "images/no-unlinked-calls.svg";

const DEFAULT_TABS = [
  {
    policyStatus: "Requested Callbacks",

    policyStatusColor: "#FBDEDE",
    name: "reminders",
  },
  {
    policyStatus: "Reminders",
    policyStatusColor: "#FEF8CB",
    name: "requestedCallbacks",
  },
  {
    policyStatus: "Unlinked Calls",
    policyStatusColor: "#DEEBFB",
    name: "unLinkedPolicies",
  },
  {
    policyStatus: "Unlinked Policies",

    policyStatusColor: "#DEEBFB",
    name: "unlinkedCalls",
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
    "To learn more about how you can receive leads through consumer callback requests,",
  Reminders:
    "To learn more about how you can receive leads through consumer callback requests.",
  "Unlinked Calls":
    "To learn more about how you can receive leads through consumer callback requests.",
  "Unlinked Policies":
    "To learn more about how you can receive leads through consumer callback requests.",
};

const getLink = {
  "Requested Callbacks": "/MedicareCENTER-Requested-Callbacks-Guide.pdf",
  Reminders: "/MedicareCENTER-Reminders-Guide.pdf",
  "Unlinked Calls": "/MedicareCENTER-Unlinked-Calls-Guide.pdf",
  "Unlinked Policies": "/MedicareCENTER-Unlinked-Policies-Guide.pdf",
};

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
        const data = DEFAULT_TABS.map((tab, i) => {
          tab.policyCount = tabsData[tab.name];
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
    fetchCounts();
  }, [addToast, dateRange, npn]);

  // we can pass card info here and accordingly set the show to true as per card

  const renderList = () => {
    switch (selectedName) {
      case "Unlinked Calls":
        return <UnLinkedCalls taskList={taskList} />;
      case "Unlinked Policies":
        return <UnlinkedPolicyList taskList={taskList} />;
      case "Reminders":
        return <RemindersList taskList={taskList} />;
      case "Requested Callbacks":
        return <RequestedCallback />;
      default:
        return <UnlinkedPolicyList />;
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
        handleWidgetSelection={setStatusIndex}
        apiTabs={tabs}
      />
      {isError || taskList?.length === 0 ? (
        <ErrorState
          isError={isError}
          emptyList={taskList?.length > 0 ? false : true}
          heading={
            selectedName === "Reminders"
              ? "There are no reminders to display at this time."
              : `There are no ${selectedName?.toLowerCase()} at this time.`
          }
          content={getMoreInfo[selectedName]}
          icon={getIcon[selectedName]}
          link={getLink[selectedName]}
        />
      ) : (
        <>{renderList()}</>
      )}
    </ContactSectionCard>
  );
}
