import React, { useEffect, useState, useCallback } from "react";
import ContactSectionCard from "packages/ContactSectionCard";
import { useHistory } from "react-router-dom";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";
import enrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import ErrorState from "components/ErrorState";
import PolicyNoData from "components/PolicySnapShot/policy-no-data.svg";
import WithLoader from "components/ui/WithLoader";
import "./style.scss";

const TitleData =
  "View your policies by status. Policy status is imported directly from carriers and the availability of status and other policy information may vary by carrier. For the most complete and up-to-date policy information, submit your applications through Contact Management Quote & eApp. Please visit our Learning Center to view the list of carriers whose policies are available in Policy Snapshot or find out more about Policy Management.";

export default function PlanSnapShot({ isMobile, npn }) {
  // Getting the index and date range from Session storage to auto select the widget and date range //
  const [index] = usePreferences(0, "policySnapShot_widget");
  const [dRange] = usePreferences(0, "policySnapShot_sort");

  const [isLoading, setIsLoading] = useState(false);
  const [policyList, setPolicyList] = useState([]);
  const [leadIds, setLeadIds] = useState([]);
  const [dateRange, setDateRange] = useState(dRange);
  const [statusIndex, setStatusIndex] = useState(index);
  const [isError, setIsError] = useState(false);
  const [tabs, setTabs] = useState([]);

  const history = useHistory();
  const addToast = useToast();

  const status = tabs[index]?.policyStatus;

  const fetchPolicySnapshotList = useCallback(
    async (statusToFetch) => {
      // If status is undefined, don't hit the fetch call //
      if (!statusToFetch) return;
      setIsLoading(true);

      try {
        const items = await enrollPlansService.getPolicySnapShotList(
          npn,
          dateRange,
          statusToFetch
        );
        const list = items[0]?.bookOfBusinessSummmaryRecords;
        const ids = items[0]?.leadIds;

        setPolicyList(list || []);
        setLeadIds(ids || []);
      } catch (error) {
        setIsError(true);
        addToast({
          type: "error",
          message: "Failed to get Policy Snapshot List.",
          time: 10000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, dateRange, npn]
  );

  const jumptoListMobile = useCallback(
    (index) => {
      const status = tabs[index]?.policyStatus || "Declined";
      const policyStatusColor = tabs[index]?.policyStatusColor || "";
      const policyCount = tabs[index]?.policyCount || "";

      const filterInfo = { status, policyStatusColor, policyCount };

      window.localStorage.setItem("filterInfo", JSON.stringify(filterInfo));
      window.localStorage.setItem("filterLeadIds", JSON.stringify(leadIds));
      history.push(`/contacts`);
    },
    [tabs, leadIds, history]
  );

  useEffect(() => {
    fetchPolicySnapshotList(status);
  }, [fetchPolicySnapshotList, status]);

  const handleWidgetSelection = useCallback(
    async (newIndex, policyCount) => {
      setStatusIndex(newIndex);
      const newStatus = tabs[newIndex]?.policyStatus || "Declined";

      // Fetch the policy list for the selected widget //
      await fetchPolicySnapshotList(newStatus);

      // If mobile, when clicking on the widget, it should take you to the contact list page //
      if (isMobile && leadIds?.length > 0 && policyCount > 0) {
        jumptoListMobile(newIndex);
      }
    },
    [fetchPolicySnapshotList, leadIds, tabs, isMobile, jumptoListMobile]
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const tabsData = await enrollPlansService.getPolicySnapShotCount(
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

  const jumptoList = (index) => {
    if (leadIds?.length > 0) {
      jumptoListMobile(index);
    }
    return true;
  };

  return (
    <ContactSectionCard
      title="Policy Snapshot"
      className={"enrollmentPlanContainer_dashboard"}
      isDashboard={true}
      infoIcon={
        <Popover
          openOn="hover"
          isPolicyList={true}
          description={TitleData}
          positions={isMobile ? ["bottom"] : ["right", "bottom"]}
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

      <WithLoader isLoading={isLoading}>
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
            policyCount={tabs?.[statusIndex]?.policyCount ?? 0}
            isError={isError}
            handleJumpList={() => jumptoList(statusIndex)}
          />
        )}
      </WithLoader>
    </ContactSectionCard>
  );
}
