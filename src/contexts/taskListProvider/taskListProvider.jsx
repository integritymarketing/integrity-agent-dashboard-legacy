import React, { createContext, useState, useCallback } from "react";
import useFetch from "hooks/useFetch";
import { LEADS_API_VERSION } from "services/clientsService";
import PropTypes from "prop-types";

/**
 * FinalExpensePlanListProvider component to provide final expenses plan context.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.Element} The rendered component.
 */

export const TaskListContext = createContext();

export const TaskListProvider = ({ children }) => {
  const URL = `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/tasks`;

  const {
    Get: fetchTaskListPlans,
    loading: isLoadingTaskListPlans,
    error: taskListPlansError,
  } = useFetch(URL);

  const [taskListPlans, setTaskListPlans] = useState([]);

  const getTaskListPlans = useCallback(
    async (npn, dateRange, statusIndex) => {
      const urlParams = `?npn=${npn}&dateRange=${dateRange}&statusIndex=${statusIndex}`;
      const data = await fetchTaskListPlans(null, false, urlParams);
      setTaskListPlans(data?.taskSummmary || []);
    },
    [fetchTaskListPlans]
  );

  return (
    <TaskListContext.Provider value={getContextValue()}>
      {children}
    </TaskListContext.Provider>
  );

  function getContextValue() {
    return {
      getTaskListPlans,
      taskListPlans,
      taskListPlansError,
      isLoadingTaskListPlans,
    };
  }
};

TaskListProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
