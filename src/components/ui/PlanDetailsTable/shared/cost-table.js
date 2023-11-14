import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import MonthlyCostTable from "./monthly-cost-table";
import MonthlyCostCompareTable from "./monthly-cost-comapare-table";

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

export const currencyFormatter = new Intl.NumberFormat("en-US", {
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

const totalCostBasedOnPlantypes = (planData, effectiveStartDate, totalCost) => {
    const type = PLAN_TYPE_ENUMS[planData.planType];
    switch (type) {
        case "PDP":
        case "MAPD":
            return currencyFormatter.format(planData.estimatedAnnualDrugCostPartialYear);
        // return currencyFormatter.format(totalCost);
        case "MA":
            return currencyFormatter.format(planData.medicalPremium * (12 - effectiveStartDate.getMonth()));

        default:
            return currencyFormatter.format(0);
    }
};

const RXCostBasedOnPlantypes = (planData) => {
    const type = PLAN_TYPE_ENUMS[planData.planType];
    switch (type) {
        case "PDP":
        case "MAPD":
            return currencyFormatter.format(planData.estimatedAnnualDrugCostPartialYear - planData.drugPremium * 12);

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

function TotalEstLabel({ effectiveMonth, effectiveYear }) {
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

function EstRxValue({ planData, monthNumber }) {
    return (
        <>
            <span className={"value"}>
                <span className={"currency-value-blue"}>{RXCostBasedOnPlantypes(planData)}</span>
                <i>
                    <span className={"value-subtext"}>{getShortFormMonthSpan(monthNumber)}</span>
                </i>
            </span>
        </>
    );
}

function EstRxLabel({ drugsCount }) {
    return (
        <>
            <span className={"label"}> Estimated Drug Cost</span>
            <span className={"subtext"}>
                <i>Based on {drugsCount} drugs </i>
            </span>
        </>
    );
}

function getShortFormMonthSpan(monthNumber) {
    if (monthNumber === 12) {
        return getMonthShortName(monthNumber - 1);
    } else {
        return getMonthShortName(monthNumber - 1) + " - " + getMonthShortName(11);
    }
}

export function TotalEstValue({ planData, effectiveStartDate, monthNumber, totalCost }) {
    return (
        <>
            <span className={"value"}>
                <span className={"currency-value-blue"}>
                    {totalCostBasedOnPlantypes(planData, effectiveStartDate, totalCost)}
                </span>
                <i>
                    <span className={"value-subtext"}>{getShortFormMonthSpan(monthNumber)}</span>
                </i>
            </span>
        </>
    );
}

const CostTable = ({ planData }) => {
    const { effectiveDate } = useParams();
    const [y, m] = effectiveDate?.split("-");
    const effectiveStartDate = new Date(`${y}-${m}-15`);

    const effectiveMonthlyCosts =
        planData && planData.pharmacyCosts?.length > 0
            ? planData.pharmacyCosts[0].monthlyCosts?.filter((mc) => mc.monthID <= 12 - parseInt(m))
            : [];
    const totalDrugCost = effectiveMonthlyCosts?.reduce((acc, curr) => {
        return (
            acc +
            (curr?.costDetail?.reduce((acc, curr) => {
                return acc + curr.memberCost;
            }, 0) || 0)
        );
    }, 0);

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

    if (PLAN_TYPE_ENUMS[planData.planType] === "MAPD" || PLAN_TYPE_ENUMS[planData.planType] === "PDP") {
        data.push({
            label: (
                <EstRxLabel
                    drugsCount={
                        (planData?.pharmacyCosts?.length > 0 && planData?.pharmacyCosts[0]?.drugCosts?.length) || 0
                    }
                    effectiveYear={y}
                    effectiveMonth={getMonthShortName(parseInt(m) - 1)}
                />
            ),
            value: <EstRxValue planData={planData} monthNumber={parseInt(m)} />,
        });
    }
    data.push({
        label: <TotalEstLabel effectiveMonth={getMonthShortName(parseInt(m) - 1)} effectiveYear={y} />,
        value: (
            <TotalEstValue
                planData={planData}
                effectiveStartDate={effectiveStartDate}
                monthNumber={parseInt(m)}
                totalCost={totalDrugCost}
            />
        ),
    });

    return (
        <>
            <PlanDetailsTableWithCollapse columns={columns} data={data} header="Costs" compareTable={true} />
            <MonthlyCostTable
                currencyFormatter={currencyFormatter}
                planData={planData}
                monthNumber={m}
                months={months}
                isShowMore={true}
            />
        </>
    );
};

export default CostTable;

export function CostCompareTable({ plans, effectiveDate }) {
    const [y, m] = effectiveDate.split("-");
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
                    drugsCount={
                        (clonedPlans?.[0]?.pharmacyCosts?.length > 0 &&
                            clonedPlans?.[0]?.pharmacyCosts[0]?.drugCosts?.length) ||
                        0
                    }
                />
            ),
            ...clonedPlans?.reduce((acc, plan, index) => {
                acc[`plan-${index}`] = plan ? <EstRxValue planData={plan} monthNumber={parseInt(m)} /> : "-";
                return acc;
            }, {}),
        },
        {
            label: <TotalEstLabel effectiveMonth={getMonthShortName(parseInt(m) - 1)} effectiveYear={y} />,
            ...clonedPlans?.reduce((acc, plan, index) => {
                acc[`plan-${index}`] = plan ? (
                    <TotalEstValue planData={plan} effectiveStartDate={effectiveStartDate} monthNumber={parseInt(m)} />
                ) : (
                    "-"
                );
                return acc;
            }, {}),
        },
    ];

    return (
        <>
            <PlanDetailsTableWithCollapse columns={columns} data={data} header="Costs" compareTable={true} />
            <MonthlyCostCompareTable plans={plans} monthNumber={m} months={months} isShowMore={true} />
        </>
    );
}
