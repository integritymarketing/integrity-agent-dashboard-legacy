import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import { labelMap } from "../mapd/tier-pharmacy-coverage";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function findPlanData({ planData, isPreffered = false, isRetail = true }) {
    const values = [];
    if (planData && planData.formularyTiers && Array.isArray(planData.formularyTiers)) {
        planData.formularyTiers.forEach((tier) => {
            if (tier && Array.isArray(tier.copayPrices)) {
                tier.copayPrices.forEach((copay) => {
                    if (copay.isPreferredPharmacy === isPreffered && copay.isMailOrder === !isRetail) {
                        if (copay.costType === 1) {
                            values.push({
                                name: labelMap[tier.tierNumber],
                                value: (
                                    <>
                                        <div className={"copay"}>
                                            <span className={"label"}>{currencyFormatter.format(copay.cost)}</span>{" "}
                                            <span className={"supply"}>copay ({copay.daysOfSupply}-day supply)</span>
                                        </div>
                                    </>
                                ),
                            });
                        } else if (copay.costType === 2) {
                            values.push({
                                name: labelMap[tier.tierNumber],
                                value: (
                                    <>
                                        <div className={"copay"}>
                                            <span className={"label"}>{Math.round(copay.cost * 100)}%</span>
                                            <span className={"supply"}>
                                                coinsurance ({copay.daysOfSupply}-day supply)
                                            </span>
                                        </div>
                                    </>
                                ),
                            });
                        }
                    }
                });
            }
        });
    }

    return values.length ? values : null;
}

export function RetailPharmacyCoverage({ plans, header, isPreffered, isRetail }) {
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
                id: "group-header",
                header,
                columns: [
                    {
                        id: "name",
                        accessorKey: "name",
                        header: "",
                        hideHeader: true,
                        cell: ({ getValue }) => <div className="extra-padding">{getValue()}</div>,
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: "",
                        hideHeader: true,
                        cell: ({ getValue }) => {
                            const value = getValue();
                            if (!plan || !value) {
                                return "-";
                            }
                            return value;
                        },
                    })),
                ],
            },
        ],
        [clonedPlans, header]
    );

    const planCoverageValues = clonedPlans.map((planData) => findPlanData({ planData }));
    const defaultData = Object.values(labelMap).map((tierName) => {
        return {
            name: tierName,
            [`plan-0`]: planCoverageValues[0]?.find(({ name }) => name === tierName)?.value,
            [`plan-1`]: planCoverageValues[1]?.find(({ name }) => name === tierName)?.value,
            [`plan-2`]: planCoverageValues[2]?.find(({ name }) => name === tierName)?.value,
        };
    });

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={columns}
                data={defaultData}
                compareTable={true}
                header={"Standard Retail Pharmacy Coverage"}
            />
        </>
    );
}