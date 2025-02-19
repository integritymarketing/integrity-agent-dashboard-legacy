import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import { labelMap } from "../mapd/tier-pharmacy-coverage";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

/**
 * Function to find pharmacy plan data
 */
function findPlanData({ planData, isPreferred = false, isRetail = true }) {
    if (!planData || !Array.isArray(planData.formularyTiers)) return null;

    return planData.formularyTiers.flatMap((tier) => {
        if (!tier || !Array.isArray(tier.copayPrices)) return [];

        return tier.copayPrices
            .filter((copay) => copay.isPreferredPharmacy === isPreferred && copay.isMailOrder !== isRetail)
            .map((copay) => ({
                name: labelMap[tier.tierNumber],
                value:
                    copay.costType === 1 ? (
                        <div className="copay">
                            <span className="label">{currencyFormatter.format(copay.cost)}</span>{" "}
                            <span className="supply">copay ({copay.daysOfSupply}-day supply)</span>
                        </div>
                    ) : (
                        <div className="copay">
                            <span className="label">{Math.round(copay.cost * 100)}%</span>
                            <span className="supply">coinsurance ({copay.daysOfSupply}-day supply)</span>
                        </div>
                    ),
            }));
    });
}

export function RetailPharmacyCoverage({
    plans = [],
    header = "Standard Retail Pharmacy Coverage",
    isPreferred,
    isRetail,
}) {
    // Ensure all plans exist in a list of 3 for column mapping
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        while (copyPlans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    /**
     * Table Columns
     */
    const columns = useMemo(
        () => [
            {
                id: "pharmacy-group",
                header,
                columns: [
                    {
                        id: "name",
                        accessorKey: "name",
                        header: "Benefit Tier",
                        cell: ({ row }) => <div className="extra-padding">{row.original.name || "-"}</div>,
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: `Plan ${index + 1}`,
                        cell: ({ row }) => {
                            const value = row.original[`plan-${index}`];
                            return value || "-";
                        },
                    })),
                ],
            },
        ],
        [clonedPlans, header]
    );

    /**
     * Table Data
     */
    const planCoverageValues = useMemo(
        () => clonedPlans.map((plan) => findPlanData({ planData: plan })),
        [clonedPlans]
    );

    const defaultData = useMemo(
        () =>
            Object.values(labelMap).map((tierName) => ({
                name: tierName,
                ...clonedPlans.reduce((acc, _, index) => {
                    acc[`plan-${index}`] =
                        planCoverageValues[index]?.find(({ name }) => name === tierName)?.value || "-";
                    return acc;
                }, {}),
            })),
        [clonedPlans, planCoverageValues]
    );

    return <PlanDetailsTableWithCollapse columns={columns} data={defaultData} compareTable={true} header={header} />;
}

export default RetailPharmacyCoverage;
