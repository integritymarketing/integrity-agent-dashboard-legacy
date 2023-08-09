import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import { useParams } from "react-router-dom";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getMonthShortName = (monthIndex) => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString("en-US", { month: "short" });
};

function PremiumLabel() {
  return <span className={"label"}>Plan Premium</span>;
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
        <span className={"currency-value-blue"}>
          {currencyFormatter.format(planData.annualPlanPremium / 12)}
        </span>
        <span className={"value-subtext"}>/month</span>
      </span>
    </>
  );
}

function EstRxLabel({ effectiveMonth, effectiveYear }) {
  return (
    <>
      <span className={"label"}>Total Estimated Cost</span>
      <span className={"subtext"}>
        <i>
          <span>Based on plan premium and drug costs</span>
        </i>
        <i>
          <span>(Effective {effectiveMonth + " " + effectiveYear})</span>
        </i>
      </span>
    </>
  );
}

function EstRxValue({ planData, effectiveStartDate, monthNumber }) {
  return (
    <>
      <span className={"value"}>
        <span className={"currency-value-blue"}>
          {RXCostBasedOnPlantypes(planData, effectiveStartDate)}
        </span>
        <i>
          <span className={"value-subtext"}>
            {getShortFormMonthSpan(monthNumber)}
          </span>
        </i>
      </span>
    </>
  );
}

function TotalEstLabel({ drugsCount }) {
  return (
    <>
      <span className={"label"}> Estimated Drug Cost</span>
      <span className={"subtext"}>
        <i>Based on {drugsCount} drugs</i>
      </span>
    </>
  );
}

function getShortFormMonthSpan(monthNumber) {
  const end = monthNumber !== 12 ? 11 : undefined;
  const effectiveMonth = monthNumber ? monthNumber - 1 : undefined;
  if (end === effectiveMonth) {
    return getMonthShortName(effectiveMonth);
  } else {
    return getMonthShortName(effectiveMonth) + " - " + getMonthShortName(end);
  }
}

export function TotalEstValue({ planData, effectiveStartDate, monthNumber }) {
  return (
    <>
      <span className={"value"}>
        <span className={"currency-value-blue"}>
          {totalCostBasedOnPlantypes(planData, effectiveStartDate)}
        </span>
        <i>
          <span className={"value-subtext"}>
            {getShortFormMonthSpan(monthNumber)}
          </span>
        </i>
      </span>
    </>
  );
}

const CostTable = ({ planData }) => {
  const { effectiveDate } = useParams();
  const [y, m] = effectiveDate?.split("-");
  const effectiveStartDate = new Date(`${y}-${m}-15`);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
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
      label: (
        <TotalEstLabel
          drugsCount={planData.pharmacyCosts[0]?.drugCosts?.length || 0}
        />
      ),
      value: (
        <TotalEstValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
          monthNumber={parseInt(m)}
        />
      ),
    },
  ];

  if (
    PLAN_TYPE_ENUMS[planData.planType] === "MAPD" ||
    PLAN_TYPE_ENUMS[planData.planType] === "PDP"
  ) {
    data.push({
      label: (
        <EstRxLabel
          effectiveYear={y}
          effectiveMonth={getMonthShortName(parseInt(m) - 1)}
        />
      ),
      value: (
        <EstRxValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
          monthNumber={parseInt(m)}
        />
      ),
    });
  }

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={data}
        planData={planData}
        header="Costs"
        currencyFormatter={currencyFormatter}
        monthNumber={m}
        months={months}
        compareTable={true}
      />
    </>
  );
};

export default CostTable;

export function CostCompareTable({ plans, effectiveDate }) {
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
      ...clonedPlans?.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? <PremiumCell planData={plan} /> : "-";
        return acc;
      }, {}),
    },
    {
      label: (
        <EstRxLabel
          effectiveYear={y}
          effectiveMonth={getMonthShortName(parseInt(m) - 1)}
        />
      ),
      ...clonedPlans?.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? (
          <EstRxValue
            planData={plan}
            effectiveStartDate={effectiveStartDate}
            monthNumber={parseInt(m)}
          />
        ) : (
          "-"
        );
        return acc;
      }, {}),
    },
    {
      label: (
        <TotalEstLabel
          drugsCount={
            (clonedPlans?.pharmacyCosts?.length > 0 &&
              clonedPlans?.pharmacyCosts[0]?.drugCosts?.length) ||
            0
          }
        />
      ),
      ...clonedPlans?.reduce((acc, plan, index) => {
        acc[`plan-${index}`] = plan ? (
          <TotalEstValue
            planData={plan}
            effectiveStartDate={effectiveStartDate}
            monthNumber={parseInt(m)}
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
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
}
