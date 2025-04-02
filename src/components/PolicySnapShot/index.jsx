import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SectionCard from 'packages/SectionCard';
import { useNavigate } from 'react-router-dom';
import DateRangeSort from '../DateRangeSort';
import TabsCard from 'components/TabsCard';
import PolicyList from './PolicyList';
import useToast from 'hooks/useToast';
import Info from 'components/icons/info-blue';
import InfoModal from 'components/PolicySnapShot/InfoModal/InfoModal';
import styles from 'components/PolicySnapShot/InfoModal/InfoModal.module.scss';
import ErrorState from 'components/ErrorState';
import PolicyNoData from 'components/PolicySnapShot/policy-no-data.svg';
import NoUnlinkedPolicy from 'images/no-unlinked-policies.svg';
import UnlinkedPolicyList from 'components/TaskList/UnlinkedPolicies';
import { useClientServiceContext } from 'services/clientServiceProvider';
import useFilteredLeadIds from 'pages/ContactsList/hooks/useFilteredLeadIds';
import { useAgentAccountContext } from 'providers/AgentAccountProvider';
import WithLoader from 'components/ui/WithLoader';
import './style.scss';
import { useContactsListContext } from 'pages/ContactsList/providers/ContactsListProvider';
import { is } from 'date-fns/locale';

const TitleData =
  'View your policies by status. Policy status is imported directly from carriers and the availability of status and other policy information may vary by carrier. For the most complete and up-to-date policy information, submit your applications through Contact Management Quote & eApp. Please visit our Learning Center to view the list of carriers whose policies are available in Policy Snapshot or find out more about Policy Management.';

const PAGESIZE = 5;
export default function PlanSnapShot({ isMobile, npn }) {
  const [isLoading, setIsLoading] = useState(true);
  const [policyList, setPolicyList] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [leadIds, setLeadIds] = useState([]);
  const [isError, setIsError] = useState(false);
  const [tabs, setTabs] = useState([]);

  const [showPolicyListInfoModal, setShowPolicyListInfoModal] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(1);
  const [selectedTab, setSelectedTab] = useState(null);
  const [dateRange, setDateRange] = useState();

  const status = useMemo(() => {
    return selectedTab?.policyStatus || 'Declined';
  }, [selectedTab]);

  const selectedTabCount = useMemo(() => {
    return tabs?.find(tab => tab.value === status)?.policyCount;
  }, [tabs, status]);

  const navigate = useNavigate();
  const showToast = useToast();
  const { enrollPlansService } = useClientServiceContext();
  const { setFilteredDataHandle } = useFilteredLeadIds();

  const {
    leadPreference,
    updateAgentPreferences,
    isLoading: fetchAgentDataLoading,
    agentId,
  } = useAgentAccountContext();

  const { selectedFilterSections, setSelectedFilterSections } =
    useContactsListContext();

  const updatePreferences = async (date, status) => {
    try {
      const payload = {
        agentID: agentId,
        leadPreference: {
          ...leadPreference,
          policySnapshotDateRange: date,
          policySnapshotTileSelection: status ? status : '3',
        },
      };
      await updateAgentPreferences(payload);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update preferences.',
        time: 10000,
      });
    }
  };

  const fetchPolicySnapshotList = useCallback(
    async (statusToFetch, date, isUpdate) => {
      // If status is undefined, don't hit the fetch call //
      setPage(1);
      setTotalPageSize(1);
      if (!statusToFetch) {
        return;
      }
      setIsLoading(true);
      try {
        const items = await enrollPlansService.getPolicySnapShotList(
          npn,
          date,
          statusToFetch
        );
        if (isUpdate) {
          await updatePreferences(date, statusToFetch);
        }
        const list = items[0]?.bookOfBusinessSummmaryRecords;
        const ids = items[0]?.leadIds;
        if (statusToFetch === 'UnlinkedPolicies') {
          setFullList(list || []);
        } else {
          setPolicyList(list || []);
        }
        setLeadIds(ids || []);
        setTotalPageSize(list?.length / PAGESIZE);
      } catch (error) {
        setIsError(true);
        showToast({
          type: 'error',
          message: 'Failed to get Policy Snapshot List.',
          time: 10000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [enrollPlansService, npn, showToast]
  );

  useEffect(() => {
    if (status === 'UnlinkedPolicies') {
      const list = fullList?.filter((task, i) => i < page * PAGESIZE);
      setPolicyList([...list]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fullList]);

  const jumptoListMobile = useCallback(
    async selectedTab => {
      const status = selectedTab?.policyStatus || 'Declined';
      const policyStatusColor = selectedTab?.policyStatusColor || '#000000';
      const policyCount = selectedTab?.policyCount || 0;

      const filterInfo = { status, policyStatusColor, policyCount };

      await updatePreferences(dateRange, status);

      setFilteredDataHandle('filterLeadIds', 'filterInfo', leadIds, filterInfo);

      navigate(`/contacts`);
    },
    [tabs, leadIds, navigate]
  );

  const fetchCounts = async (status, date, isUpdate) => {
    try {
      const tabsData = await enrollPlansService.getPolicySnapShotCount(
        npn,
        date
      );
      if (tabsData?.length > 0) {
        const selectedTabCount = tabsData?.find(
          tab => tab.policyStatus === status
        )?.policyCount;
        const updatedTabs = tabsData?.map(tab => ({
          ...tab,
          value: tab.policyStatus,
        }));
        setTabs([...updatedTabs]);
        if (selectedTabCount > 0) {
          fetchPolicySnapshotList(status, date, isUpdate);
        } else {
          setPolicyList([]);
          setFullList([]);
          setLeadIds([]);
          if (isUpdate) {
            await updatePreferences(date, status);
          }
        }
      }
    } catch (error) {
      console.log('Error in fetch policy count: ', error);
      showToast({
        type: 'error',
        message: 'Failed to get Policy Snapshot Count.',
        time: 10000,
      });
    }
  };

  const handleWidgetSelection = useCallback(
    async (tab, date, isUpdate) => {
      setSelectedTab(tab);
      if (date) {
        setDateRange(date);
      }
      const newStatus = tab?.policyStatus;
      const policyCount = tab?.policyCount;
      const selectedDate = date || dateRange;
      if (newStatus === 'UnlinkedPolicies' && isMobile) {
        navigate(`/policy-snapshot-mobile-layout/${npn}/${selectedDate}`);
      }
      // If mobile, when clicking on the widget, it should take you to the contact list page except for UnlinkedPolicies //
      if (
        isMobile &&
        leadIds?.length > 0 &&
        policyCount > 0 &&
        newStatus !== 'UnlinkedPolicies'
      ) {
        jumptoListMobile(tab);
      } else {
        fetchPolicySnapshotList(newStatus, selectedDate, isUpdate);
      }
    },
    [leadIds, isMobile, jumptoListMobile, fetchPolicySnapshotList]
  );

  const initialAPICall = useCallback(() => {
    const policySnapshotDateRange = leadPreference?.policySnapshotDateRange;
    const policySnapshotTileSelection =
      leadPreference?.policySnapshotTileSelection;

    if (
      policySnapshotDateRange &&
      policySnapshotTileSelection &&
      !(
        dateRange === policySnapshotDateRange &&
        status === policySnapshotTileSelection
      )
    ) {
      let tab = {
        policyStatus: policySnapshotTileSelection,
      };
      setSelectedTab(tab);
      if (policySnapshotDateRange) {
        setDateRange(policySnapshotDateRange);
      }

      if (policySnapshotTileSelection) {
        fetchCounts(policySnapshotTileSelection, policySnapshotDateRange);
      }
    }
  }, [leadPreference, dateRange, status]);

  const handleDateRangeSelection = date => {
    setDateRange(date);
    fetchCounts(status, date, true);
  };

  useEffect(() => {
    if (leadPreference) {
      initialAPICall();
    }
  }, [leadPreference]);

  const jumptoList = selectedTab => {
    if (selectedFilterSections.length > 0) {
      setSelectedFilterSections([]);
    }

    if (leadIds?.length > 0) {
      jumptoListMobile(selectedTab);
    }
    return true;
  };

  const getErrorHeading = status => {
    switch (status) {
      case 'UnlinkedPolicies': {
        return 'There are no Unlinked Policies at this time.';
      }

      default:
        return `There is no policy information available for you at this time.`;
    }
  };

  const getIcon = status => {
    switch (status) {
      case 'UnlinkedPolicies':
        return NoUnlinkedPolicy;
      default:
        return PolicyNoData;
    }
  };

  const getMoreInfo = status => {
    switch (status) {
      case 'UnlinkedPolicies': {
        return 'about unlinked policies.';
      }
      default:
        return 'New policies will be displayed here once they are submitted. Please contact your marketer for more information.';
    }
  };

  const getLink = status => {
    switch (status) {
      case 'UnlinkedPolicies': {
        return 'MedicareCENTER-Unlinked-Policies-Guide.pdf';
      }
      default:
        return null;
    }
  };

  return (
    <>
      <SectionCard
        title='Policy Snapshot'
        className={'enrollmentPlanContainer_dashboard'}
        isDashboard={true}
        infoIcon={
          <div
            onClick={() => setShowPolicyListInfoModal(true)}
            className={styles.infoIcon}
          >
            <Info />
          </div>
        }
        actions={
          <DateRangeSort
            dateRange={dateRange}
            setDateRange={handleDateRangeSelection}
            preferencesKey={'policySnapShot_sort'}
          />
        }
        preferencesKey={'policySnapShot_collapse'}
      >
        <TabsCard
          tabs={tabs}
          selectedTabValue={status}
          handleWidgetSelection={handleWidgetSelection}
          isMobile={isMobile}
        />

        <WithLoader isLoading={isLoading || fetchAgentDataLoading}>
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

          {!isMobile && status !== 'UnlinkedPolicies' && (
            <PolicyList
              policyList={policyList}
              policyCount={selectedTabCount ?? 0}
              isError={isError}
              handleJumpList={() => jumptoList(selectedTab)}
            />
          )}
          {status === 'UnlinkedPolicies' && !isMobile && (
            <UnlinkedPolicyList
              policyList={policyList}
              showMore={page < totalPageSize}
              setPage={() => setPage(page + 1)}
              npn={npn}
            />
          )}
        </WithLoader>
      </SectionCard>
      {showPolicyListInfoModal && (
        <InfoModal
          open={showPolicyListInfoModal}
          onClose={() => setShowPolicyListInfoModal(false)}
          isMobile={isMobile}
        />
      )}
    </>
  );
}
