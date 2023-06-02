import React, { useEffect, useState } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import TooltipMUI from "packages/ToolTip";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";
import EnrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";

const DEFAULT_TABS = [
  {
    heading: "Started",
    key: "started",
    bgColor: "#deebfb",
  },
  {
    heading: "Applied",
    key: "applied",
    bgColor: "#fcf6b0",
  },
  {
    heading: "Issued",
    key: "issued",
    bgColor: "#defbe6",
  },
  {
    heading: "Declined",
    key: "declined",
    bgColor: "#fbdede",
  },
];

const TitleData =
  "Policy Snapshot shows the number of contacts that are in each stage for MedicareCENTER only.";

export default function PlanSnapShot({ isMobile, npn }) {
  const [index] = usePreferences(0, "policySnapShot_widget");
  const [dRange] = usePreferences(0, "policySnapShot_sort");

  const [policyList, setpolicyList] = useState([]);
  const [leadIds, setLeadIds] = useState([]);
  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);

  const [tabs, setTabs] = useState([]);

  const addToast = useToast();

  useEffect(() => {
    const fetchEnrollPlans = async () => {
      let status = DEFAULT_TABS[statusIndex]?.heading || "Started";
      try {
        const items = await EnrollPlansService.getPolicySnapShotList(
          npn,
          dateRange,
          status
        );
        if (items?.length > 0) {
          const list = items[0]?.bookOfBusinessSummmaryRecords;
          const ids = items[0]?.leadIds;
          setpolicyList([...list]);
          setLeadIds(ids);
        } else {
          setpolicyList([]);
          setLeadIds([]);
        }
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to get Policy Snapshot List.",
          time: 10000,
        });
      }
    };
    fetchEnrollPlans();
  }, [addToast, statusIndex, dateRange, npn]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await EnrollPlansService.getPolicySnapShotCount(
          npn,
          dateRange
        );
        const tabsCount = DEFAULT_TABS.map((tab) => {
          return { ...tab, value: data[tab.key] };
        });

        setTabs([...tabsCount]);
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to get Policy Snapshot Count.",
          time: 10000,
        });
      }
    };
    fetchCounts();
  }, [addToast, dateRange, npn]);

  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={"enrollmentPlanContainer"}
      infoIcon={<TooltipMUI titleData={TitleData} />}
      actions={
        <DateRangeSort
          dateRange={dateRange}
          setDateRange={setDateRange}
          preferencesKey={"policySnapShot_sort"}
        />
      }
      preferencesKey={"policySnapShot_collapse"}
    >
      <TabsCard
        tabs={tabs}
        preferencesKey={"policySnapShot_widget"}
        statusIndex={statusIndex}
        setStatusIndex={setStatusIndex}
      />
      {!isMobile && <PolicyList policyList={policyList} leadIds={leadIds} />}
    </ContactSectionCard>
  );
}
