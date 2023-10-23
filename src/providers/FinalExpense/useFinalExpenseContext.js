import { useContext } from "react";

import { FinalExpensePlansListContext } from "./FinalExpensePlansProvider";

export const useFinalExpensePlansList = () =>
  useContext(FinalExpensePlansListContext) ?? {};
