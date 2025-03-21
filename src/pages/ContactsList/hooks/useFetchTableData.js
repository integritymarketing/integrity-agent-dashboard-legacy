import * as Sentry from '@sentry/react';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useToast from 'hooks/useToast';
import { getAndResetItemFromLocalStorage } from 'utils/shared-utils/sharedUtility';
import { useContactListAPI } from 'providers/ContactListAPIProviders';
function useFetchTableData() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [pageResult, setPageResult] = useState(null);
  const showToast = useToast();
  const location = useLocation();
  const { getContactListPost, getLeadsList } = useContactListAPI();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const applyFilters = useMemo(() => {
    return {
      contactRecordType: queryParams.get('ContactRecordType'),
      hasReminder: queryParams.get('HasReminder'),
      stages: queryParams.get('Stage')
        ? queryParams.get('Stage').split(',')
        : [],
      tags: queryParams.get('Tags') ? queryParams.get('Tags').split(',') : [],
      hasOverdueReminder: queryParams.get('HasOverdueReminder'),
    };
  }, [queryParams]);
  const fetchTableDataWithoutFilters = useCallback(
    async ({ pageIndex, pageSize, sort, searchString, returnAll }) => {
      try {
        const duplicateIds =
          getAndResetItemFromLocalStorage('duplicateLeadIds');
        const filterLeadIds = getAndResetItemFromLocalStorage('filterLeadIds');
        const leadIds = filterLeadIds || duplicateIds || null;

        const response = await getLeadsList(
          pageIndex,
          pageSize,
          sort,
          searchString,
          leadIds,
          applyFilters?.contactRecordType,
          applyFilters?.stages,
          applyFilters?.hasReminder,
          applyFilters?.hasOverdueReminder,
          applyFilters?.tags,
          returnAll
        );

        return {
          total: response?.pageResult?.total || 0,
          leadsList: response?.result || [],
          leadIdsList: response?.result?.map(contact => contact.leadsId) || [],
        };
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to fetch table data',
          time: 5000,
        });
        return { total: 0, leadsList: [], leadIdsList: [] };
      }
    },
    [applyFilters, showToast, getLeadsList]
  );

  /**
   * Fetch table data WITH filters
   */
  const fetchTableData = useCallback(
    async ({
      pageIndex,
      pageSize,
      sort,
      searchString,
      returnAll,
      isSilent = false,
      selectedFilterSections = [],
      filterSectionsConfig,
      appendData = false,
    }) => {
      try {
        if (!isSilent && selectedFilterSections.length === 0) {
          setIsLoading(true);
        }

        const duplicateIds =
          getAndResetItemFromLocalStorage('duplicateLeadIds');
        const filterLeadIds = getAndResetItemFromLocalStorage('filterLeadIds');
        const campaignsLeadIds =
          getAndResetItemFromLocalStorage('campaignsLeadIds');

        const leadIds =
          filterLeadIds || duplicateIds || campaignsLeadIds || null;
        let response;

        if (selectedFilterSections.length === 0) {
          response = await getLeadsList(
            pageIndex,
            pageSize,
            sort,
            searchString,
            leadIds,
            applyFilters?.contactRecordType,
            applyFilters?.stages,
            applyFilters?.hasReminder,
            applyFilters?.hasOverdueReminder,
            applyFilters?.tags,
            returnAll
          );
        } else {
          response = await getContactListPost(
            pageIndex,
            pageSize,
            sort,
            searchString,
            returnAll,
            selectedFilterSections,
            filterSectionsConfig
          );
        }
        if (response?.result) {
          const listData = response?.result.map(res => ({
            ...res,
            contactRecordType:
              (res.contactRecordType === 'Client' ||
                res.contactRecordType === 'client') &&
              !res.statusName
                ? 'Enrolled'
                : res.contactRecordType,
          }));

          setPageResult(response?.pageResult);

          // Update table immediately
          if (appendData) {
            setTableData(prev => [...prev, ...listData]);
            setAllLeads(prev => [
              ...prev,
              ...listData.map(contact => contact.leadsId),
            ]);
          } else {
            setTableData(listData);
            setAllLeads(listData.map(contact => contact.leadsId));
          }
        }
      } catch (error) {
        console.log('Failed to fetch table data', error);
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to load data',
          time: 10000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [applyFilters, showToast, getLeadsList, getContactListPost]
  );

  return {
    tableData,
    isLoading,
    fetchTableData,
    fetchTableDataWithoutFilters,
    allLeads,
    pageResult,
  };
}

export default useFetchTableData;
