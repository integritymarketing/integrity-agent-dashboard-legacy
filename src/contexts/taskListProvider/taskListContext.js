import { useContext } from "react";

import { TaskListContext } from "./taskListProvider";

export const useTaskList = () => useContext(TaskListContext) ?? {};
