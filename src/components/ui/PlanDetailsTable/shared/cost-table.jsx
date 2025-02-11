import { PLAN_TYPE_ENUMS } from "../../../../constants";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import MonthlyCostTable from "./monthly-cost-table";
import MonthlyCostCompareTable from "./monthly-cost-comapare-table";
import { usePharmacyContext } from "providers/PharmacyProvider/usePharmacyContext";

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

const determinePharmacyCosts = (planData) => {
    const { selectedPharmacy } = usePharmacyContext();

    return selectedPharmacy.pharmacyId
        ? planData?.pharmacyCosts?.find((rx) => rx?.pharmacyID == selectedPharmacy.pharmacyId)
        : planData?.pharmacyCosts?.find((rx) => rx?.pharmacyType === 2 || rx?.isMailOrder);
};

const determineEstimatedCostCalculationsRxs = (planData) => {
    const { selectedPharmacy } = usePharmacyContext();

    return selectedPharmacy.pharmacyId
        ? planData?.estimatedCostCalculationRxs?.find((rx) => rx?.pharmacyId == selectedPharmacy.pharmacyId)
        : planData?.estimatedCostCalculationRxs?.find((rx) => rx?.pharmacyType === 2 || rx?.isMailOrder);
};

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

function PremiumCell({ planData }) {
    const pharmacyCosts = determineEstimatedCostCalculationsRxs(planData);
    const monthlyPremium = pharmacyCosts?.monthlyPlanPremium || 0;

    return (
        <>
            <span className={"value"}>
                <span className={"currency-value-blue"}>{currencyFormatter.format(monthlyPremium)}</span>
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
                    <span>(Effective {`${effectiveMonth} ${effectiveYear}`})</span>
                </i>
            </span>
        </>
    );
}

export function EstRxValue({ planData, monthNumber }) {
    const pharmacyCosts = determineEstimatedCostCalculationsRxs(planData);
    const drugCost = pharmacyCosts?.estimatedYearlyRxDrugCost || 0;

    return (
        <>
            <span className={"value"}>
                <span className={"currency-value-blue"}>{currencyFormatter.format(drugCost)}</span>
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
        return `${getMonthShortName(monthNumber - 1)} - ${getMonthShortName(11)}`;
    }
}

export function TotalEstValue({ planData, monthNumber }) {
    const pharmacyCosts = determineEstimatedCostCalculationsRxs(planData);
    const totalDrugCost = pharmacyCosts?.estimatedYearlyTotalCost || 0;

    return (
        <>
            <span className={"value"}>
                <span className={"currency-value-blue"}>{currencyFormatter.format(totalDrugCost)}</span>
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

    const pharmacyCosts = determinePharmacyCosts(planData);

    const effectiveMonthlyCosts =
        planData && pharmacyCosts?.length > 0
            ? pharmacyCosts?.monthlyCosts?.filter((mc) => mc.monthID <= 12 - parseInt(m))
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
                id: "costs-group",
                header: "Costs",
                columns: [
                    {
                        id: "cost-label",
                        header: "Label",
                        cell: ({ row }) => row.original.label, // ✅ Corrected from `accessor`
                    },
                    {
                        id: "cost-value",
                        header: "Value",
                        cell: ({ row }) => row.original.value, // ✅ Corrected from `accessor`
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
                    drugsCount={pharmacyCosts?.drugCosts?.length || 0}
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
                acc[`plan-${index}`] = plan ? (
                    <EstRxValue planData={plan} monthNumber={parseInt(m)} effectiveStartDate={effectiveStartDate} />
                ) : (
                    "-"
                );
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