import React from "react";
import { FinalExpensePlansList } from "./FinalExpensePlansList";
import { FinalExpensePlansProvider } from "providers/FinalExpense";

const FinalExpenseWithProvider = () => {
  return (
    <FinalExpensePlansProvider>
      <FinalExpensePlansList />
    </FinalExpensePlansProvider>
  );
};

export default FinalExpenseWithProvider;
