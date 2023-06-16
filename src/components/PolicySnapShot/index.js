import React, { useEffect, useState } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import { useHistory } from "react-router-dom";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";
import EnrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import ErrorState from "components/ErrorState";
import PolicyNoData from "components/PolicySnapShot/policy-no-data.svg";
import "./style.scss";

const TitleData =
  "Policy Snapshot shows the number of contacts that are in each stage for MedicareCENTER only.";

export default function PlanSnapShot({ isMobile, npn }) {
  const [index] = usePreferences(0, "policySnapShot_widget");
  const [dRange] = usePreferences(0, "policySnapShot_sort");

  const [policyList, setpolicyList] = useState([]);
  const [leadIds, setLeadIds] = useState([]);
  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);
  const [isError, setIsError] = useState(false);
  const [tabs, setTabs] = useState([]);

  const history = useHistory();
  const addToast = useToast();

  const status = tabs[statusIndex]?.policyStatus || "Started";

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
        setIsError(true);
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
        console.log("Error in fetch policy count: ", error);
        addToast({
          type: "error",
          message: "Failed to get Policy Snapshot Count.",
          time: 10000,
        });
      }
    };
    fetchCounts();
  }, [addToast, dateRange, npn]);

  const handleWidgetSelection = (index, policyCount) => {
    setStatusIndex(index);
    if (isMobile && policyCount > 0) {
      jumptoList(index);
    }
  };

  const jumptoList = (index) => {
    if (leadIds.length > 0) {
      let status = tabs[index]?.policyStatus || "Started";
      let policyStatusColor = tabs[index]?.policyStatusColor || "";
      let policyCount = tabs[index]?.policyCount || "";

      const filterInfo = { status, policyStatusColor, policyCount };

      window.localStorage.setItem("filterInfo", JSON.stringify(filterInfo));
      window.localStorage.setItem("filterLeadIds", JSON.stringify(leadIds));
      goToContactPage();
    }
    return true;
  };

  const goToContactPage = () => {
    history.push(`/contacts`);
  };

  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={"enrollmentPlanContainer"}
      infoIcon={
        <Popover
          openOn="hover"
          description={TitleData}
          positions={["right", "bottom"]}
        >
          <Info />
        </Popover>
      }
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
        handleWidgetSelection={handleWidgetSelection}
        isMobile={isMobile}
        page="policySnapshot"
      />

      {(isError || policyList?.length === 0) && (
        <ErrorState
          isError={isError}
          emptyList={policyList?.length > 0 ? false : true}
          heading={`There is no policy information available for you at this time.`}
          content={`New policies will be displayed here once they are submitted.
          Please contact your marketer for more information.`}
          icon={PolicyNoData}
        />
      )}

      {!isMobile && (
        <PolicyList
          policyList={policyList}
          isError={isError}
          handleJumpList={() => jumptoList(statusIndex)}
        />
      )}
    </ContactSectionCard>
  );
}
