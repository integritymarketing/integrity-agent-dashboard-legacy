import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function PlanBenefitsCompareTable({ plans }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        if (plans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const allPlanBenefits = clonedPlans.reduce((acc, pb) => {
        if (pb) {
            acc.push(...pb.planDataFields);
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
                            if (!plan || !value) return "-";
                            return <div dangerouslySetInnerHTML={{ __html: value.description }} />;
                        },
                    })),
                ],
            },
        ],
        [clonedPlans]
    );

    const buildData = (planData, document) => {
        return planData?.planDataFields.find((pr) => pr.name === document.name);
    };

    const defaultData = [
        {
            name: "Medical Deductible",
            [`plan-0`]: {
                description: plans[0] ? currencyFormatter.format(plans[0].medicalDeductible) : "",
            },
            [`plan-1`]: {
                description: plans[1] ? currencyFormatter.format(plans[1].medicalDeductible) : "",
            },
            [`plan-2`]: {
                description: plans[2] ? currencyFormatter.format(plans[2].medicalDeductible) : "",
            },
        },
        {
            name: "In-Network Maximum out of Pocket",
            [`plan-0`]: {
                description: plans[0] ? currencyFormatter.format(plans[0].maximumOutOfPocketCost) : "",
            },
            [`plan-1`]: {
                description: plans[1] ? currencyFormatter.format(plans[1].maximumOutOfPocketCost) : "",
            },
            [`plan-2`]: {
                description: plans[2] ? currencyFormatter.format(plans[2].maximumOutOfPocketCost) : "",
            },
        },
    ];

    const uniqPlans = {};
    allPlanBenefits.forEach((doc) => {
        if (!uniqPlans[doc.name]) {
            uniqPlans[doc.name] = doc;
        }
    });

    const data = Object.values(uniqPlans).map((document) => ({
        name: document.name,
        [`plan-0`]: buildData(plans[0], document),
        [`plan-1`]: buildData(plans[1], document),
        [`plan-2`]: buildData(plans[2], document),
    }));

    return (
        <>
            <PlanDetailsTableWithCollapse
                columns={columns}
                data={[...defaultData, ...data]}
                compareTable={true}
                header={"Plan Benefits"}
            />
        </>
    );
}