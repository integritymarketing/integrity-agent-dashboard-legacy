import { useContext } from "react";

import { FinalExpensePlansContext } from "./FinalExpensePlansProvider";

export const useFinalExpensePlans = () =>
  useContext(FinalExpensePlansContext) ?? {};
