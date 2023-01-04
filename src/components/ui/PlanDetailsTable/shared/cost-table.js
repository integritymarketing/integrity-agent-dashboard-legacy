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

const totalCostBasedOnPlantypes = (planData, effectiveStartDate) => {
  const type = PLAN_TYPE_ENUMS[planData.planType];
  switch (type) {
    case "PDP":
      return currencyFormatter.format(
        planData?.estimatedAnnualDrugCostPartialYear
      );
    case "MA":
      return currencyFormatter.format(
        (planData.annualPlanPremium / 12) * (12 - effectiveStartDate.getMonth())
      );
    case "MAPD":
      return currencyFormatter.format(
        (planData.estimatedAnnualDrugCostPartialYear / 12 +
          planData.annualPlanPremium / 12) *
          (12 - effectiveStartDate.getMonth())
      );
    default:
      return null;
  }
};

const RXCostBasedOnPlantypes = (planData, effectiveStartDate) => {
  const type = PLAN_TYPE_ENUMS[planData.planType];
  switch (type) {
    case "PDP":
      return currencyFormatter.format(
        planData?.estimatedAnnualDrugCostPartialYear
      );

    case "MAPD":
      return currencyFormatter.format(
        (planData.estimatedAnnualDrugCostPartialYear / 12) *
          (12 - effectiveStartDate.getMonth())
      );
    default:
      return null;
  }
};

function PremiumCell({ planData }) {
  return (
    <>
      <span className={"value"}>
        <span className={"currency"}>
          {currencyFormatter.format(planData.annualPlanPremium / 12)}
        </span>
        <span className={"per"}>/month</span>
        <span className={"per-mobile"}>Monthly</span>
      </span>
    </>
  );
}

function EstRxLabel() {
  return (
    <>
      <span className={"label"}>Estimated Yearly Rx Drug Cost</span>
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
  const ddd = RXCostBasedOnPlantypes(planData, effectiveStartDate);
  console.log("KJKJ", ddd);
  return (
    <>
      <span className={"value"}>
        <span className={"currency"}>
          {RXCostBasedOnPlantypes(planData, effectiveStartDate)}
        </span>
        <span className={"per"}>{isFullYear ? "/year" : "/partial year"}</span>
        <span className={"per-mobile"}>Yearly</span>
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
      <span className={"label"}>Total Estimated Yearly Cost</span>
      <span className={"subtext"}>
        Estimate based on monthly premium and estimated Rx drug costs.
      </span>
    </>
  );
}

function TotalEstValue({ planData, effectiveStartDate, isFullYear = true }) {
  const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
    month: "long",
  })} ${effectiveStartDate.getFullYear()} `;

  return (
    <>
      <span className={"value"}>
        <span className={"currency"}>
          {totalCostBasedOnPlantypes(planData, effectiveStartDate)}
        </span>
        <span className={"per"}>{isFullYear ? "/year" : "/partial year"}</span>
        <span className={"per-mobile"}>Yearly</span>
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
