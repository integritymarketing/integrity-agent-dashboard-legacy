import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import { useParams } from "react-router-dom";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

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
    case "MAPD":
      return currencyFormatter.format(
        planData.estimatedAnnualDrugCostPartialYear +
          planData.medicalPremium * (12 - effectiveStartDate.getMonth())
      );
    case "MA":
      return currencyFormatter.format(
        planData.medicalPremium * (12 - effectiveStartDate.getMonth())
      );

    default:
      return currencyFormatter.format(0);
  }
};

const RXCostBasedOnPlantypes = (planData) => {
  const type = PLAN_TYPE_ENUMS[planData.planType];
  switch (type) {
    case "PDP":
    case "MAPD":
      return currencyFormatter.format(
        planData.estimatedAnnualDrugCostPartialYear
      );

    default:
      return currencyFormatter.format(0);
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
      <span className={"label"}> Estimated Yearly Total Cost</span>
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
  const [y, d] = effectiveDate?.split("-");
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
    {
      label: <TotalEstLabel />,
      value: (
        <TotalEstValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
        />
      ),
    },
  ];

  if (
    PLAN_TYPE_ENUMS[planData.planType] === "MAPD" ||
    PLAN_TYPE_ENUMS[planData.planType] === "PDP"
  ) {
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

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={data}
        header="Costs"
      />
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
