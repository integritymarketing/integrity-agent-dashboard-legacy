import React from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import TooltipMUI from "packages/ToolTip";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";

const DEFAULT_TABS = [
  {
    heading: "Started",
    bgColor: "#deebfb",
    value: "4",
  },
  {
    heading: "Applied",
    bgColor: "#fcf6b0",
    value: "8",
  },
  {
    heading: "Issued",
    bgColor: "#defbe6",
    value: "34",
  },
  {
    heading: "Declined",
    bgColor: "#fbdede",
    value: "74",
  },
];

const TitleData =
  "Policy Snapshot shows the number of contacts that are in each stage for MedicareCENTER only.";

export default function PlanSnapShot({ isMobile }) {
  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={"enrollmentPlanContainer"}
      infoIcon={<TooltipMUI titleData={TitleData} />}
      actions={<DateRangeSort preferencesKey={"policySnapShot_sort"} />}
      preferencesKey={"policySnapShot_collapse"}
    >
      <TabsCard tabs={DEFAULT_TABS} preferencesKey={"policySnapShot_widget"} />
      <PolicyList />
    </ContactSectionCard>
  );
}
