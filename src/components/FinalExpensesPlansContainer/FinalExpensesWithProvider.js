import React from "react";
import { FinalExpensesPlansList } from "./FinalExpensesPlansList";
import { FinalExpensesPlansListProvider } from "providers/FinalExpenses";

const FinalExpensesWithProvider = () => {
  return (
    <FinalExpensesPlansListProvider>
      <FinalExpensesPlansList />
    </FinalExpensesPlansListProvider>
  );
};

export default FinalExpensesWithProvider;
