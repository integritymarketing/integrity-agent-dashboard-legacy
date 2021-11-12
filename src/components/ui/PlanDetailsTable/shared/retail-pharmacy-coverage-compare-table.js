import React, { useMemo } from "react";
import PlanDetailsTable from "..";
import { labelMap } from "../mapd/tier-pharmacy-coverage";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function RetailPharmacyCoverage({
  plans,
  header,
  isPreffered,
  isRetail,
}) {
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
        Header: header,
        columns: [
          {
            hideHeader: true,
            accessor: "name",
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
    [clonedPlans,header]
  );

  const tierNumbersFromAllPlans = useMemo(
    () => {
      debugger
      return Object.keys(
        plans.filter(Boolean).reduce((acc, planData) => {
          planData.formularyTiers.map((tier) => acc[tier.tierNumber]);
          return acc;
        }, {})
      )
    },
    [plans]
  );

  const tierValue = (plan, tierNumber) => {
    const tier =
      plan?.formularyTiers?.find((tier) => tier.tierNumber === tierNumber) ||
      {};
    var values = [];
    if (tier && Array.isArray(tier.copayPrices)) {
      tier.copayPrices.forEach((copay) => {
        if (
          copay.isPreferredPharmacy === isPreffered &&
          copay.isMailOrder === !isRetail
        ) {
          if (copay.costType === 1) {
            values.push(
              <>
                <div className={"copay"}>
                  <span className={"label"}>
                    {currencyFormatter.format(copay.cost)}
                  </span>{" "}
                  <span className={"supply"}>
                    copay ({copay.daysOfSupply}-day supply)
                  </span>
                </div>
              </>
            );
          } else if (copay.costType === 2) {
            values.push(
              <>
                <div className={"copay"}>
                  <span className={"label"}>{copay.cost * 100}%</span>
                  <span className={"supply"}>
                    coinsurance ({copay.daysOfSupply}-day supply)
                  </span>
                </div>
              </>
            );
          }
        }
      });
    }
    return values;
  };

  const buildData = (tierNumber) => {
    return {
      name: labelMap[tierNumber],
      [`plan-0`]: {
        description: tierValue(plans[0], tierNumber),
      },
      [`plan-1`]: {
        description: tierValue(plans[1], tierNumber),
      },
      [`plan-2`]: {
        description: tierValue(plans[2], tierNumber),
      },
    };
  };

  const defaultData = tierNumbersFromAllPlans.map(buildData);

  return (
    <>
      <PlanDetailsTable
        columns={columns}
        data={defaultData}
        compareTable={true}
      />
    </>
  );
}
