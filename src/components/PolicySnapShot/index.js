import React, { useEffect, useState } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import TooltipMUI from "packages/ToolTip";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";
import EnrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";

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
  const status = tabs[statusIndex]?.policyStatus || "Started";
  const colorCode = tabs[statusIndex]?.colorCode || "";

  useEffect(() => {
    const fetchEnrollPlans = async () => {
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
  }, [addToast, statusIndex, dateRange, npn, status]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const tabsData = await EnrollPlansService.getPolicySnapShotCount(
          npn,
          dateRange
        );

        setTabs([...tabsData]);
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to get Policy Snapshot Count.",
          time: 10000,
        });
      }
    };
    fetchCounts();
  }, [addToast, dateRange, npn, statusIndex]);

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
      {!isMobile && (
        <PolicyList
          policyList={policyList}
          leadIds={leadIds}
          status={status}
          colorCode={colorCode}
        />
      )}
    </ContactSectionCard>
  );
}
