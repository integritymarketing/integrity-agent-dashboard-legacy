import { useContext } from "react";

import { FinalExpensesPlansListContext } from "./FinalExpensesProvider";

export const useFinalExpensesPlansList = () =>
  useContext(FinalExpensesPlansListContext) ?? {};
