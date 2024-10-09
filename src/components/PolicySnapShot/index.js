import React, { useEffect, useState, useCallback } from "react";
import SectionCard from "packages/SectionCard";
import { useNavigate } from "react-router-dom";
import DateRangeSort from "../DateRangeSort";
import TabsCard from "components/TabsCard";
import PolicyList from "./PolicyList";
import useToast from "hooks/useToast";
import usePreferences from "hooks/usePreferences";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";
import ErrorState from "components/ErrorState";
import PolicyNoData from "components/PolicySnapShot/policy-no-data.svg";
import NoUnlinkedPolicy from "images/no-unlinked-policies.svg";
import UnlinkedPolicyList from "components/TaskList/UnlinkedPolicies";
import { useClientServiceContext } from "services/clientServiceProvider";
import useFilteredLeadIds from "pages/ContactsList/hooks/useFilteredLeadIds";

import WithLoader from "components/ui/WithLoader";
import "./style.scss";
import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

const TitleData =
    "View your policies by status. Policy status is imported directly from carriers and the availability of status and other policy information may vary by carrier. For the most complete and up-to-date policy information, submit your applications through Contact Management Quote & eApp. Please visit our Learning Center to view the list of carriers whose policies are available in Policy Snapshot or find out more about Policy Management.";

const PAGESIZE = 5;
export default function PlanSnapShot({ isMobile, npn }) {
    // Getting the index and date range from Session storage to auto select the widget and date range //
    const [index] = usePreferences(0, "policySnapShot_widget");
    const [dRange] = usePreferences(0, "policySnapShot_sort");

    const [isLoading, setIsLoading] = useState(false);
    const [policyList, setPolicyList] = useState([]);
    const [fullList, setFullList] = useState([]);
    const [leadIds, setLeadIds] = useState([]);
    const [dateRange, setDateRange] = useState(dRange);
    const [statusIndex, setStatusIndex] = useState(index);
    const [isError, setIsError] = useState(false);
    const [tabs, setTabs] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPageSize, setTotalPageSize] = useState(1);

    const navigate = useNavigate();
    const showToast = useToast();
    const { enrollPlansService } = useClientServiceContext();
    const { setFilteredDataHandle } = useFilteredLeadIds();

    const { selectedFilterSections, setSelectedFilterSections } = useContactsListContext();
    const status = tabs[statusIndex]?.policyStatus;
    const fetchPolicySnapshotList = useCallback(
        async (statusToFetch) => {
            // If status is undefined, don't hit the fetch call //
            setPage(1);
            setTotalPageSize(1);
            if (!statusToFetch) {
                return;
            }
            setIsLoading(true);

            try {
                const items = await enrollPlansService.getPolicySnapShotList(npn, dateRange, statusToFetch);
                const list = items[0]?.bookOfBusinessSummmaryRecords;
                const ids = items[0]?.leadIds;
                if (statusToFetch === "UnlinkedPolicies") {
                    setFullList(list || []);
                } else {
                    setPolicyList(list || []);
                }
                setLeadIds(ids || []);
                setTotalPageSize(list?.length / PAGESIZE);
            } catch (error) {
                setIsError(true);
                showToast({
                    type: "error",
                    message: "Failed to get Policy Snapshot List.",
                    time: 10000,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [enrollPlansService, npn, dateRange, showToast]
    );

    useEffect(() => {
        if (status === "UnlinkedPolicies") {
            const list = fullList?.filter((task, i) => i < page * PAGESIZE);
            setPolicyList([...list]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, fullList]);

    const jumptoListMobile = useCallback(
        (index) => {
            const status = tabs[index]?.policyStatus || "Declined";
            const policyStatusColor = tabs[index]?.policyStatusColor || "";
            const policyCount = tabs[index]?.policyCount || "";

            const filterInfo = { status, policyStatusColor, policyCount };

            setFilteredDataHandle("filterLeadIds", "filterInfo", leadIds, filterInfo);

            navigate(`/contacts`);
        },
        [tabs, leadIds, navigate]
    );

    useEffect(() => {
        fetchPolicySnapshotList(status);
    }, [fetchPolicySnapshotList, status]);

    const handleWidgetSelection = useCallback(
        async (newIndex, policyCount) => {
            const newStatus = tabs[newIndex]?.policyStatus;
            if (newStatus === "UnlinkedPolicies" && isMobile) {
                navigate(`/policy-snapshot-mobile-layout/${npn}`);
            }
            // If mobile, when clicking on the widget, it should take you to the contact list page except for UnlinkedPolicies //
            if (isMobile && leadIds?.length > 0 && policyCount > 0 && newStatus !== "UnlinkedPolicies") {
                jumptoListMobile(newIndex);
            } else {
                setStatusIndex(newIndex);
            }
        },
        [leadIds, isMobile, jumptoListMobile]
    );

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const tabsData = await enrollPlansService.getPolicySnapShotCount(npn, dateRange);
                setTabs([...tabsData]);
            } catch (error) {
                console.log("Error in fetch policy count: ", error);
                showToast({
                    type: "error",
                    message: "Failed to get Policy Snapshot Count.",
                    time: 10000,
                });
            }
        };
        fetchCounts();
    }, [showToast, dateRange, npn]);

    const jumptoList = (index) => {
        if (selectedFilterSections.length > 0) {
            setSelectedFilterSections([]);
        }

        if (leadIds?.length > 0) {
            jumptoListMobile(index);
        }
        return true;
    };

    const getErrorHeading = (status) => {
        switch (status) {
            case "UnlinkedPolicies": {
                return "There are no Unlinked Policies at this time.";
            }

            default:
                return `There is no policy information available for you at this time.`;
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case "UnlinkedPolicies":
                return NoUnlinkedPolicy;
            default:
                return PolicyNoData;
        }
    };

    const getMoreInfo = (status) => {
        switch (status) {
            case "UnlinkedPolicies": {
                return "about unlinked policies.";
            }
            default:
                return "New policies will be displayed here once they are submitted. Please contact your marketer for more information.";
        }
    };

    const getLink = (status) => {
        switch (status) {
            case "UnlinkedPolicies": {
                return "MedicareCENTER-Unlinked-Policies-Guide.pdf";
            }
            default:
                return null;
        }
    };

    return (
        <SectionCard
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
                        heading={getErrorHeading(status)}
                        content={getMoreInfo(status)}
                        icon={getIcon(status)}
                        link={getLink(status)}
                    />
                )}

                {!isMobile && status !== "UnlinkedPolicies" && (
                    <PolicyList
                        policyList={policyList}
                        policyCount={tabs?.[statusIndex]?.policyCount ?? 0}
                        isError={isError}
                        handleJumpList={() => jumptoList(statusIndex)}
                    />
                )}
                {status === "UnlinkedPolicies" && !isMobile && (
                    <UnlinkedPolicyList
                        policyList={policyList}
                        showMore={page < totalPageSize}
                        setPage={() => setPage(page + 1)}
                        npn={npn}
                    />
                )}
            </WithLoader>
        </SectionCard>
    );
}
