import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function PharmacyCoverageCompareTable({ plans }) {
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
        Header: "Pharmacy Coverage",
        columns: [
          {
            hideHeader: true,
            accessor: "name",
            Cell({ value }) {
              return <div className="extra-padding">{value}</div>;
            },
          },
          ...clonedPlans.map((plan, index) => ({
            hideHeader: true,
            accessor: `plan-${index}`,
            Cell({ value }) {
              if (!plan || !value) {
                return "-";
              }
              return (
                <div dangerouslySetInnerHTML={{ __html: value.description }} />
              );
            },
          })),
        ],
      },
    ],
    [clonedPlans]
  );

  const defaultData = [
    {
      name: "Pharmacy Deductible",
      [`plan-0`]: {
        description: plans[0]
          ? currencyFormatter.format(plans[0].drugDeductible)
          : "",
      },
      [`plan-1`]: {
        description: plans[1]
          ? currencyFormatter.format(plans[1].drugDeductible)
          : "",
      },
      [`plan-2`]: {
        description: plans[2]
          ? currencyFormatter.format(plans[2].drugDeductible)
          : "",
      },
    },
    {
      name: "Initial Coverage Limit",
      [`plan-0`]: {
        description: plans[0]
          ? currencyFormatter.format(plans[0].initialCoverageLimit)
          : "",
      },
      [`plan-1`]: {
        description: plans[1]
          ? currencyFormatter.format(plans[1].initialCoverageLimit)
          : "",
      },
      [`plan-2`]: {
        description: plans[2]
          ? currencyFormatter.format(plans[2].initialCoverageLimit)
          : "",
      },
    },
  ];

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={defaultData}
        compareTable={true}
        header={"Pharmacy Coverage"}
      />
    </>
  );
}