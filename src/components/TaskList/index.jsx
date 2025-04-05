/* eslint-disable max-lines-per-function */
import { useEffect, useState, useMemo, use, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';
import { useAgentAccountContext } from 'providers/AgentAccountProvider';

import { sortListByDate } from 'utils/dates';

import useToast from 'hooks/useToast';

import SectionCard from 'packages/SectionCard';

import ErrorState from 'components/ErrorState';
import TabsCard from 'components/TabsCard';
import Info from 'components/icons/info-blue';
import { Button } from 'components/ui/Button';
import WithLoader from 'components/ui/WithLoader';

import { StageStatusProvider } from 'contexts/stageStatus';
import { useClientServiceContext } from 'services/clientServiceProvider';

import UnLinkedTextAndCalls from './UnlinkedTextAndCalls';

import { InfoModal } from './InfoModal/InfoModal';
import PlanEnrollLeads from './PlanEnrollLeads';
import RemindersList from './Reminders';
import Soa48HoursRule from './Soa48HoursRule/Soa48HoursRule';
import styles from './styles.module.scss';

import DateRangeSort from '../DateRangeSort';

import NoReminder from 'images/no-reminder.svg';
import NoSOA48Hours from 'images/no-soa-48-hours.svg';
import NoUnlinkedCalls from 'images/no-unlinked-calls.svg';

const DEFAULT_TABS = [
  {
    policyStatus: 'PlanEnroll Leads',
    policyStatusColor: '#4178FF',
    name: 'PlanEnrollLeads',
    value: '3',
  },
  {
    policyStatus: 'Reminders',
    policyStatusColor: '#4178FF',
    name: 'Reminders',
    value: '1',
  },
  {
    policyStatus: 'Unlinked',
    policyStatusColor: '#DEEBFB',
    name: 'UnlinkedCommunications',
    value: '4',
  },
  {
    policyStatus: 'Health SOAs',
    policyStatusColor: '#4178FF',
    name: 'Soa48HoursRule',
    value: '0',
  },
];

const getLink = {
  1: 'MedicareCENTER-Reminders-Guide.pdf',
  4: 'MedicareCENTER-Unlinked-Calls-Guide.pdf',
};

export default function TaskList({
  isMobile,
  npn,
  leadPreference,
  updateAgentPreferencesData,
}) {
  const PAGESIZE = isMobile ? 3 : 5;
  const navigate = useNavigate();
  const { clientsService } = useClientServiceContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fullList, setFullList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageSize, setTotalPageSize] = useState(1);
  const [showTaskListInfoModal, setShowTaskListInfoModal] = useState(false);
  const showToast = useToast();
  const [selectedTab, setSelectedTab] = useState(null);
  const [dateRange, setDateRange] = useState();

  const selectedTabValue = useMemo(() => {
    return selectedTab ? selectedTab?.value : 3;
  }, [selectedTab]);

  const selectedTabCount = useMemo(() => {
    return tabs?.find(tab => tab.value === selectedTabValue)?.policyCount;
  }, [tabs, selectedTabValue]);

  const shouldHide48SOA = useMemo(() => {
    return leadPreference?.hideHealthQuote;
  }, [leadPreference]);

  const showMore = useMemo(() => {
    return page < totalPageSize;
  }, [page, totalPageSize]);

  const updatePreferences = useCallback(
    async (date, tile) => {
      try {
        const payload = {
          taskListDateRange: date ? date : dateRange,
          taskListTileSelection: tile ? tile : '3',
        };
        await updateAgentPreferencesData(payload);
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to update preferences.',
          time: 10000,
        });
      }
    },
    [updateAgentPreferencesData, showToast]
  );

  const fetchTaskListByWidget = async (date, widgetNumber, isUpdate) => {
    if (widgetNumber === '3') {
      if (isUpdate) {
        await updatePreferences(date, widgetNumber);
      }
      return;
    }
    setIsLoading(true);
    setTotalPageSize(1);
    setPage(1);

    try {
      const response = await clientsService.getTaskList(
        npn,
        date,
        widgetNumber
      );
      const taskSummaryList = response?.taskSummmary || [];
      if (isUpdate) {
        await updatePreferences(date, widgetNumber);
      }
      if (taskSummaryList.length > 0) {
        const sortedTasks = taskSummaryList.sort((a, b) =>
          moment(b.taskDate, 'MM/DD/YYYY HH:mm:ss').diff(
            moment(a.taskDate, 'MM/DD/YYYY HH:mm:ss')
          )
        );

        const pageCount = Math.ceil(sortedTasks.length / PAGESIZE);
        setTotalPageSize(pageCount);
        setFullList(sortedTasks);

        handlePaginatedTaskListUpdate(sortedTasks, 1, widgetNumber);
      } else {
        setTaskList([]);
        setTotalPageSize(response?.pageResult?.totalPages || 1);
      }
    } catch (error) {
      setIsError(true);
      showToast({
        type: 'error',
        message: 'Failed to get Task List.',
        time: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 👇 Refactored function for fetching task counts (tab values)
  const fetchTaskListCounts = async (
    selectedDate,
    selectedTabValue,
    isUpdate
  ) => {
    try {
      const countData = await clientsService.getTaskListCount(
        npn,
        selectedDate
      );
      let visibleTabs = shouldHide48SOA
        ? DEFAULT_TABS.filter(tab => tab.name !== 'Soa48HoursRule')
        : [...DEFAULT_TABS];

      if (countData?.length > 0) {
        const selectedTabName = DEFAULT_TABS.find(
          tab => tab.value === selectedTabValue
        )?.name;
        const selectedTabCount = countData.find(
          tab => tab.name === selectedTabName
        )?.count;
        if (selectedTabCount > 0) {
          fetchTaskListByWidget(selectedDate, selectedTabValue, isUpdate);
        } else {
          setTaskList([]);
          setTotalPageSize(1);
          setPage(1);
          if (isUpdate) {
            await updatePreferences(selectedDate, selectedTabValue);
          }
        }
        const updatedTabs = visibleTabs.map(tab => {
          const match = countData.find(t => t.name === tab.name);
          return {
            ...tab,
            policyCount: match?.count || 0,
            policyStatusColor: match?.color || '#4178FF',
          };
        });
        setTabs(updatedTabs);
      } else {
        setTabs(visibleTabs);
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to get Task List Count.',
        time: 10000,
      });
    }
  };

  const handlePaginatedTaskListUpdate = (
    list = [],
    pageNumber = 1,
    tabValue = 3
  ) => {
    if (!Array.isArray(list)) {
      setTaskList([]);
      return;
    }

    let sortedList = [];

    switch (tabValue) {
      case 3:
        sortedList = sortListByDate(list, 'signedDate', false);
        break;
      case 0:
        sortedList = [...list].sort((a, b) =>
          moment(b.taskList, 'MM/DD/YYYY HH:mm:ss').diff(
            moment(a.taskList, 'MM/DD/YYYY HH:mm:ss')
          )
        );
        break;
      case 1:
        sortedList = sortListByDate(list, 'taskDate', true);
        break;
      default:
        sortedList = [...list];
        break;
    }

    const paginatedList = sortedList.slice(0, pageNumber * PAGESIZE);
    setTaskList(paginatedList);
  };

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handlePaginatedTaskListUpdate(fullList, nextPage, selectedTabValue);
  };

  const handleWidgetSelection = async (tab, date, isUpdate) => {
    setSelectedTab(tab);
    const dateValue = date ? date : dateRange;
    if (tab?.value) {
      fetchTaskListByWidget(dateValue, tab?.value, isUpdate);
    }

    if (isMobile && tab?.policyCount > 0) {
      navigate(
        `/taskList-results-mobile-layout/${npn}/${tab?.name}/${dateValue}`
      );
    }
  };

  const initialAPICall = useCallback(() => {
    const taskListDateRange = leadPreference?.taskListDateRange;
    const taskListTileSelection = leadPreference?.taskListTileSelection;

    if (
      taskListDateRange &&
      taskListTileSelection &&
      !(
        dateRange === taskListDateRange &&
        selectedTabValue === taskListTileSelection
      )
    ) {
      let tab = {
        value: taskListTileSelection,
        name: DEFAULT_TABS?.filter(
          tab => tab.value === taskListTileSelection
        )[0]?.policyStatus,
        policyStatusColor: '#4178FF',
      };
      setSelectedTab(tab);
      if (taskListDateRange) {
        setDateRange(taskListDateRange);
      }

      if (taskListTileSelection) {
        fetchTaskListCounts(taskListDateRange, taskListTileSelection);
      }
    }
  }, [leadPreference, dateRange, selectedTabValue]);

  const handleDateRangeSelection = date => {
    setDateRange(date);
    fetchTaskListCounts(date, selectedTabValue, true);
  };

  useEffect(() => {
    if (leadPreference) {
      initialAPICall();
    }
  }, [leadPreference]);

  const refreshData = id => {
    fetchTaskListCounts(dateRange);
    if (id) {
      const list = fullList?.filter(task => task.id !== id);
      setFullList([...list]);
    }
  };
  const renderList = () => {
    switch (selectedTabValue) {
      case '4':
        return (
          <UnLinkedTextAndCalls taskList={taskList} refreshData={refreshData} />
        );

      case '1':
        return <RemindersList taskList={taskList} refreshData={refreshData} />;
      case '0':
        return (
          <Soa48HoursRule
            isMobile={isMobile}
            taskList={taskList || []}
            refreshData={refreshData}
          />
        );

      default:
        return null;
    }
  };

  const getErrorHeading = () => {
    switch (selectedTabValue) {
      case '1': {
        return 'There are no reminders to display at this time.';
      }
      case '0': {
        return 'There are no incomplete SOAs being tracked for you at this time.';
      }
      case '3': {
        return 'There are no PlanEnroll leads for you at this time.';
      }
      case '4': {
        return 'There are no unlinked Text and Calls for you at this time.';
      }
      default:
        return `There are no results at this time.`;
    }
  };

  const getIcon = () => {
    switch (selectedTabValue) {
      case '1':
        return NoReminder;
      case '4':
        return NoUnlinkedCalls;
      case '3':
        return NoSOA48Hours;
      case '0':
        return NoSOA48Hours;
      default:
        return null;
    }
  };

  const getMoreInfo = () => {
    switch (selectedTabValue) {
      case '1': {
        return 'about how you can create reminders.';
      }
      case '4': {
        return 'about unlinked Text and Calls .';
      }
      case '0': {
        return 'To track an SOA sent through Contact Management, make sure you check the “Track SOA” box on the Send SOA screen. Tracked SOAs will be displayed here once they’re signed by your Contacts. When you complete tracked SOAs, they’ll be removed from this view but will still be available in the Contact records.';
      }
      default:
    }
  };

  return (
    <>
      <SectionCard
        title='Task List'
        className={styles.enrollmentPlanContainer_dashboard}
        isDashboard={true}
        infoIcon={
          <div
            onClick={() => setShowTaskListInfoModal(true)}
            className={styles.infoIcon}
          >
            <Info />
          </div>
        }
        actions={
          <DateRangeSort
            isMobile={isMobile}
            preferencesKey={'taskList_sort'}
            dateRange={dateRange}
            setDateRange={handleDateRangeSelection}
          />
        }
        preferencesKey={'taskList_collapse'}
      >
        <TabsCard
          tabs={tabs}
          handleWidgetSelection={handleWidgetSelection}
          isMobile={isMobile}
          selectedTabValue={selectedTabValue}
        />

        {isError || selectedTabCount === 0 ? (
          <ErrorState
            isError={isError}
            emptyList={selectedTabCount === 0}
            heading={getErrorHeading()}
            content={getMoreInfo()}
            icon={getIcon()}
            link={getLink[selectedTabValue]}
          />
        ) : (
          <>
            {selectedTabValue !== '3' && (
              <WithLoader isLoading={isLoading}>
                <>
                  {!isMobile && (
                    <>
                      {renderList()}
                      {showMore && (
                        <div className='jumpList-card'>
                          <Button
                            type='tertiary'
                            onClick={handleShowMore}
                            label='Show More'
                            className='jumpList-btn'
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              </WithLoader>
            )}
            {selectedTabValue === '3' && !isMobile && (
              <StageStatusProvider>
                <PlanEnrollLeads dateRange={dateRange} />
              </StageStatusProvider>
            )}
          </>
        )}
      </SectionCard>
      {showTaskListInfoModal && (
        <InfoModal
          open={showTaskListInfoModal}
          onClose={() => setShowTaskListInfoModal(false)}
          isMobile={isMobile}
        />
      )}
    </>
  );
}
