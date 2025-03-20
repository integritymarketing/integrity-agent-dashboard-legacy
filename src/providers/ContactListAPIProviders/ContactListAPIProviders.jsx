import { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useUserProfile from 'hooks/useUserProfile';
import useToast from 'hooks/useToast';
import useAnalytics from 'hooks/useAnalytics';
import useFetch from 'hooks/useFetch';
import { LEADS_ONLY_API_VERSION } from 'services/clientsService';

export const ContactListAPIContext = createContext();

export const ContactListAPIProvider = ({ children }) => {
  const { fireEvent } = useAnalytics();
  const { agentId } = useUserProfile();
  const showToast = useToast();
  const [errorCode, setErrorCode] = useState(null);

  const POST_CONTACT_LIST = `${
    import.meta.env.VITE_LEADS_URL
  }/api/${LEADS_ONLY_API_VERSION}/Leads/GetLeads`;

  const GET_CONTACT_LIST = `${
    import.meta.env.VITE_LEADS_URL
  }/api/${LEADS_ONLY_API_VERSION}`;

  const { Post: getContactListByPostAPI } = useFetch(POST_CONTACT_LIST);
  const { Get: getContactListByGetAPI } = useFetch(GET_CONTACT_LIST);

  const getContactListPost = useCallback(
    async (
      page,
      pageSize,
      sort,
      searchText,
      returnAll,
      selectedFilterSections,
      filterSectionsConfig
    ) => {
      setErrorCode(null);
      if (!navigator.onLine) {
        setErrorCode('offline');
        return;
      }
      selectedFilterSections = selectedFilterSections.filter(
        item => item.selectedFilterOption
      );
      let remindersKeys = {};
      const reminderSection = selectedFilterSections?.find(
        item => item.sectionId === 'reminders'
      );
      if (reminderSection) {
        remindersKeys = getRemindersKeys(
          reminderSection.selectedIsOption,
          reminderSection.selectedFilterOption
        );
      }
      const stageSections = selectedFilterSections?.filter(
        item => item.sectionId === 'stage'
      );
      let stageArray = [];
      if (stageSections.length) {
        stageSections.forEach(stage => {
          if (stage.selectedIsOption === 'is_not') {
            if (stageArray.length) {
              const restOfStageIds = stageArray.filter(
                item => item !== stage.selectedFilterOption
              );
              stageArray = restOfStageIds;
            } else {
              const restOfStageIds = filterSectionsConfig.stage.options
                .filter(item => item.value !== stage.selectedFilterOption)
                .map(item => item.value);
              stageArray = restOfStageIds;
            }
          } else {
            if (!stageArray.includes(stage.selectedFilterOption)) {
              stageArray.push(stage.selectedFilterOption);
            }
          }
        });
      }

      const filterTagV3Request = [];
      const tagsSections = selectedFilterSections?.filter(
        item => item.sectionId !== 'stage' && item.sectionId !== 'reminders'
      );
      if (tagsSections.length) {
        tagsSections.forEach(tagSection => {
          const tagSectionIndex = selectedFilterSections.findIndex(
            item => item.id === tagSection.id
          );
          const previousSection =
            tagSectionIndex === 0
              ? null
              : selectedFilterSections[tagSectionIndex - 1];
          const andOrValue =
            previousSection?.nextAndOrOption === 'or' ? 'OR' : 'AND';
          const selectedIsOption =
            tagSection.selectedIsOption === 'is_not' ? 'ISNOT' : 'IS';
          filterTagV3Request.push({
            logicalOperator: andOrValue,
            tagId: tagSection.selectedFilterOption,
            condition: selectedIsOption,
          });
        });
      }

      const body = {
        pageSize,
        currentPage: page,
        sort: sort,
        stage: stageArray.length ? stageArray : null,
        tags: null,
        search: searchText,
        includeContactPreference: true,
        includeReminder: true,
        includeTags: true,
        includeAddress: true,
        ...remindersKeys,
        returnAll: returnAll,
        filterTagV3Request,
      };
      try {
        const response = await getContactListByPostAPI(body, true);
        if (response.status === 200) {
          const data = await response.json();
          if (data?.result?.length === 0) {
            setErrorCode(204);
          }
          return data;
        } else {
          setErrorCode(response.status);
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to load data',
          time: 10000,
        });
      }
    },
    [showToast, getContactListByPostAPI]
  );

  const getLeadsList = useCallback(
    async (
      page,
      pageSize,
      sort,
      searchText,
      leadIds,
      contactRecordType = '',
      stages = [],
      hasReminder = false,
      hasOverdueReminder = false,
      tags = [],
      returnAll,
      IncludePolicyCounts = true,
      IncludeAddress = true,
      IncludeReminder = true,
      IncludeTags = true,
      IncludeContactPreference = true
    ) => {
      setErrorCode(null);
      if (!navigator.onLine) {
        setErrorCode('offline');
        return;
      }
      const params = {
        ReturnAll: returnAll,
        PageSize: pageSize,
        CurrentPage: page,
        Search: searchText,
        leadIds,
        IncludeReminder: IncludeReminder,
        IncludePolicyCounts: IncludePolicyCounts,
        IncludeAddress: IncludeAddress,
        IncludeTags: IncludeTags,
        IncludeContactPreference: IncludeContactPreference,
      };
      if (hasReminder) {
        params.HasReminder = hasReminder;
      }
      if (hasOverdueReminder) {
        params.HasOverdueReminder = hasOverdueReminder;
      }
      if (contactRecordType !== '') {
        params.ContactRecordType = contactRecordType;
      }
      if (stages && stages.length > 0) {
        params.Stage = stages;
      }
      if (tags && tags.length > 0) {
        params.Tags = tags;
      }

      if (sort && sort.length > 0) {
        params.Sort = sort;
      }

      const queryStr = Object.keys(params)
        .map(key => {
          if (key === 'leadIds' && leadIds) {
            return (params[key] || [])
              .map(leadId => `${key}=${leadId}`)
              .join('&');
          }
          if (key === 'Stage') {
            return stages.map(stageId => `${key}=${stageId}`).join('&');
          }
          if (key === 'Tags') {
            return tags.map(tagId => `${key}=${tagId}`).join('&');
          }
          if (key === 'Sort') {
            return sort.map(sortId => `${key}=${sortId}`).join('&');
          }
          return params[key] ? `${key}=${params[key]}` : null;
        })
        .filter(str => str !== null)
        .join('&');
      try {
        const path = `Leads?${queryStr}`;
        const response = await getContactListByGetAPI(null, true, path);

        if (response.status === 200) {
          const data = await response.json();
          if (data?.result?.length === 0 && data?.pageResult?.total > 0) {
            setErrorCode(204);
          } else if (
            data?.result?.length === 0 &&
            data?.pageResult?.total === 0
          ) {
            setErrorCode('noLeads');
          }
          return data;
        } else {
          setErrorCode(response.status);
        }
      } catch (error) {
        console.log('Failed to fetch more contacts', error);
        showToast({
          type: 'error',
          message: 'Failed to load data',
          time: 10000,
        });
      }
    },
    [showToast, getContactListByGetAPI]
  );

  return (
    <ContactListAPIContext.Provider value={getContextValue()}>
      {children}
    </ContactListAPIContext.Provider>
  );

  function getContextValue() {
    return { getContactListPost, getLeadsList, errorCode };
  }
};

ContactListAPIProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
