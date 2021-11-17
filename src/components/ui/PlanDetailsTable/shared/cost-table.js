import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import { useParams } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function PremiumLabel() {
  return <span className={"label"}>Premium</span>;
}

function PremiumCell({ planData }) {
  return (
    <>
      <span className={"value"}>
        {currencyFormatter.format(planData.annualPlanPremium / 12)}
        <span className={"per"}>/month</span>
      </span>
    </>
  );
}

function EstRxLabel() {
  return (
    <>
      <span className={"label"}>Estimated Rx Drug Cost</span>
      <span className={"subtext"}>
        Estimate based on contacts prescriptions and selected pharmacy.
      </span>
    </>
  );
}

function EstRxValue({ planData, effectiveStartDate, isFullYear = true }) {
  const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
    month: "long",
  })} ${effectiveStartDate.getFullYear()} `;
  return (
    <>
      <span className={"value"}>
        {currencyFormatter.format(planData.estimatedAnnualDrugCostPartialYear)}
        <span className={"per"}>{isFullYear ? "/year" : "/partial year"}</span>
      </span>
      <span className={"subtext"}>
        Estimated based on a {effectiveDateString}
        effective date.
      </span>
    </>
  );
}

function TotalEstLabel() {
  return (
    <>
      <span className={"label"}>Total Estimated Cost</span>
      <span className={"subtext"}>
        Estimate based on monthly premium and estimated Rx drug costs.
      </span>
    </>
  );
}

function TotalEstValue({ planData, effectiveStartDate, isFullYear = true }) {
  const monthsRemaining = 12 - effectiveStartDate.getMonth();
  const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
    month: "long",
  })} ${effectiveStartDate.getFullYear()} `;

  return (
    <>
      <span className={"value"}>
        {currencyFormatter.format(
          planData.medicalPremium * monthsRemaining +
            planData.estimatedAnnualDrugCostPartialYear
        )}
        <span className={"per"}>{isFullYear ? "/year" : "/partial year"}</span>
      </span>
      <span className={"subtext"}>
        Estimated based on a {effectiveDateString} effective date.
      </span>
    </>
  );
}

export default ({ planData }) => {
  const { effectiveDate } = useParams();
  const [y, d] = effectiveDate.split("-");
  const effectiveStartDate = new Date(`${y}-${d}-15`);

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
      label: <PremiumLabel />,
      value: <PremiumCell planData={planData} />,
    },
  ];

  if (PLAN_TYPE_ENUMS[planData.planType] === "MAPD") {
    data.push({
      label: <EstRxLabel />,
      value: (
        <EstRxValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
        />
      ),
    });
  }

  if (
    PLAN_TYPE_ENUMS[planData.planType] === "MAPD" ||
    PLAN_TYPE_ENUMS[planData.planType] === "PDP"
  ) {
    data.push({
      label: <TotalEstLabel />,
      value: (
        <TotalEstValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
        />
      ),
    });
  }
  return (
    <>
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};

export function CostCompareTable({ plans, isFullYear, effectiveDate }) {
  const [y, m] = effectiveDate.split("-");
  const effectiveStartDate = new Date(`${y}-${m}-15`);
  const clonedPlans = useMemo(() => {
    const copyPlans = [...plans];
    if (plans.length < 3) {
      copyPlans.push(null);
    }
    return copyPlans;
  }, [plans]);

  const columns = useMemo(
    () => [
      {
        Header: "Costs",
        columns: [
          {
            hideHeader: true,
            accessor: "label",
          },
          ...clonedPlans.map((plan, index) => ({
            hideHeader: true,
            accessor: `plan-${index}`,
          })),
        ],
      },
    ],
    [clonedPlans]
  );
  const data = [
    {
      label: <PremiumLabel />,
      ...clonedPlans.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? <PremiumCell planData={plan} /> : "-";
        return acc;
      }, {}),
    },
    {
      label: <EstRxLabel />,
      ...clonedPlans.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? (
          <EstRxValue
            planData={plan}
            effectiveStartDate={effectiveStartDate}
            isFullYear={isFullYear}
          />
        ) : (
          "-"
        );
        return acc;
      }, {}),
    },
    {
      label: <TotalEstLabel />,
      ...clonedPlans.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? (
          <TotalEstValue
            planData={plan}
            effectiveStartDate={effectiveStartDate}
            isFullYear={isFullYear}
          />
        ) : (
          "-"
        );
        return acc;
      }, {}),
    },
  ];

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} compareTable={true} />
    </>
  );
}
