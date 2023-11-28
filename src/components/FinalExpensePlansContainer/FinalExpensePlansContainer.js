import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { FinalExpensePlanCard } from "./FinalExpensePlanCard";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { useFinalExpensePlans } from "providers/FinalExpense";
import Box from "@mui/material/Box";
import { FinalexpensePlanOptioncard } from "./FinalexpensePlanOptioncard";
import styles from "./index.module.scss";

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

export const FinalExpensePlansContainer = () => {
  const { contactId } = useParams();

  const {
    getFinalExpensePlans,
    finalExpensePlans,
    isLoadingFinalExpensePlans,
  } = useFinalExpensePlans();

  useEffect(() => {
    getFinalExpensePlans(QUOTE_ID);
  }, [getFinalExpensePlans]);

  const renderPlanCardLoaders = useMemo(() => {
    const loaders = Array.from({ length: 10 }, (_, i) => (
      <PlanCardLoader key={i} />
    ));
    return loaders;
  }, []);

  const renderPlanCards = useMemo(
    () =>
      finalExpensePlans?.map(
        ({
          Company,
          Rates,
          CompensationWarning,
          PolicyFee,
          IsSocialSecurityBillingSupported,
          PlanInfo,
          UnderwritingWarning,
        }) => (
          <FinalExpensePlanCard
            company={Company}
            rates={Rates}
            compensationWarning={CompensationWarning}
            policyFee={PolicyFee}
            isSocialSecurityBillingSupported={IsSocialSecurityBillingSupported}
            planInfo={PlanInfo}
            underwritingWarning={UnderwritingWarning}
          />
        )
      ),
    [finalExpensePlans]
  );

  return (
    <>
      <Box className={styles.FinalExpenseContainer}>
        <Box className={styles.planOptionsCardContainer}>
          <FinalexpensePlanOptioncard contactId={contactId} />
        </Box>

        <Box className={styles.planCardsContainer}>
          {isLoadingFinalExpensePlans ? renderPlanCardLoaders : renderPlanCards}
        </Box>
      </Box>
    </>
  );
};
