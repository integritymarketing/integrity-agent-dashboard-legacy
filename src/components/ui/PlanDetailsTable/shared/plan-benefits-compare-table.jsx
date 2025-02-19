import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function PlanBenefitsCompareTable({ plans = [] }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        while (copyPlans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const allPlanBenefits = clonedPlans.reduce((acc, plan) => {
        if (plan && plan.planDataFields) {
            acc.push(...plan.planDataFields);
        }
        return acc;
    }, []);

    const columns = useMemo(
        () => [
            {
                id: "plan-benefits-group",
                header: "Plan Benefits",
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

    const buildData = (planData, document) => {
        if (!planData) return null;
        return planData?.planDataFields?.find((pr) => pr.name === document.name) || null;
    };

    const defaultData = useMemo(
        () => [
            {
                name: "Medical Deductible",
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = plan
                        ? { description: currencyFormatter.format(plan.medicalDeductible || 0) }
                        : null;
                    return acc;
                }, {}),
            },
            {
                name: "In-Network Maximum out of Pocket",
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = plan
                        ? { description: currencyFormatter.format(plan.maximumOutOfPocketCost || 0) }
                        : null;
                    return acc;
                }, {}),
            },
        ],
        [clonedPlans]
    );

    const uniqPlans = {};
    allPlanBenefits.forEach((doc) => {
        if (!uniqPlans[doc.name]) {
            uniqPlans[doc.name] = doc;
        }
    });

    const data = useMemo(
        () =>
            Object.values(uniqPlans).map((document) => ({
                name: document.name,
                ...clonedPlans.reduce((acc, plan, index) => {
                    acc[`plan-${index}`] = buildData(plan, document);
                    return acc;
                }, {}),
            })),
        [clonedPlans, uniqPlans]
    );

    return (
        <PlanDetailsTableWithCollapse
            columns={columns}
            data={[...defaultData, ...data]}
            compareTable={true}
            header={"Plan Benefits"}
        />
    );
}

export default PlanBenefitsCompareTable;
