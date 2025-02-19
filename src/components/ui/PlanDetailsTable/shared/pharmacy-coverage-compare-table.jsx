import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function PharmacyCoverageCompareTable({ plans = [] }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        while (copyPlans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const columns = useMemo(
        () => [
            {
                id: "pharmacy-coverage-group",
                header: "Pharmacy Coverage",
                columns: [
                    {
                        id: "name",
                        accessorKey: "name",
                        header: "Benefit",
                        cell: ({ getValue }) => <div className="extra-padding">{getValue()}</div>,
                    },
                    ...clonedPlans.map((plan, index) => ({
                        id: `plan-${index}`,
                        accessorKey: `plan-${index}`,
                        header: `Plan ${index + 1}`,
                        cell: ({ row }) => {
                            const value = row.original[`plan-${index}`];
                            if (!plan || !value || !value.description) return "-";
                            return <div dangerouslySetInnerHTML={{ __html: value.description }} />;
                        },
                    })),
                ],
            },
        ],
        [clonedPlans]
    );

    const defaultData = useMemo(
        () => [
            {
                name: "Pharmacy Deductible",
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = plan
                        ? { description: currencyFormatter.format(plan.drugDeductible || 0) }
                        : null;
                    return acc;
                }, {}),
            },
            {
                name: "Initial Coverage Limit",
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = plan
                        ? { description: currencyFormatter.format(plan.initialCoverageLimit || 0) }
                        : null;
                    return acc;
                }, {}),
            },
        ],
        [clonedPlans]
    );

    return (
        <PlanDetailsTableWithCollapse
            columns={columns}
            data={defaultData}
            compareTable={true}
            header={"Pharmacy Coverage"}
        />
    );
}

export default PharmacyCoverageCompareTable;
