import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PlanDetailsTable from "..";
import { parseDate } from "utils/dates";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default ({ planData }) => {
  const { effectiveDate } = useParams();
  const effectiveStartDate = parseDate(effectiveDate, "yyyy-MM-dd");
  const monthsRemaining = 12 - effectiveStartDate.getMonth();
  const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
    month: "long",
  })} ${effectiveStartDate.getFullYear()} `;
  const columns = useMemo(
    () => [
      {
        Header: "Costs",
        columns: [
          {
            hideHeader: true,
            accessor: "label",
          },
          {
            hideHeader: true,
            accessor: "value",
          },
        ],
      },
    ],
    []
  );
  const data = [
    {
      label: <span className={"label"}>Premium</span>,
      value: (
        <>
          <span className={"value"}>
            {currencyFormatter.format(planData.annualPlanPremium / 12)}
            <span className={"per"}>/month</span>
          </span>
        </>
      ),
    },
  ];

  if (PLAN_TYPE_ENUMS[planData.planType] === "MAPD") {
    data.push({
      label: (
        <>
          <span className={"label"}>Estimated Rx Drug Cost</span>
          <span className={"subtext"}>
            Estimate based on contacts prescriptions and selected pharmacy.
          </span>
        </>
      ),
      value: (
        <>
          <span className={"value"}>
            {currencyFormatter.format(
              planData.estimatedAnnualDrugCostPartialYear
            )}
            <span className={"per"}>/year</span>
          </span>
          <span className={"subtext"}>
            Estimated based on a {effectiveDateString}
            effective date.
          </span>
        </>
      ),
    });
  }

  if (
    PLAN_TYPE_ENUMS[planData.planType] === "MAPD" ||
    PLAN_TYPE_ENUMS[planData.planType] === "PDP"
  ) {
    data.push({
      label: (
        <>
          <span className={"label"}>Total Estimated Cost</span>
          <span className={"subtext"}>
            Estimate based on monthly premium and estimated Rx drug costs.
          </span>
        </>
      ),
      value: (
        <>
          <span className={"value"}>
            {currencyFormatter.format(
              planData.medicalPremium * monthsRemaining +
                planData.estimatedAnnualDrugCostPartialYear
            )}
            <span className={"per"}>/year</span>
          </span>
          <span className={"subtext"}>
            Estimated based on a {effectiveDateString} effective date.
          </span>
        </>
      ),
    });
  }
  return (
    <>
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};
