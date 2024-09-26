import React, { useState, useMemo } from "react";
import ArrowDown from "../../../icons/arrow-down";
import PlanDetailsTable from "../index";
import Media from "react-media";
import { currencyFormatter } from "./prescription";
import { usePharmacyContext } from "providers/PharmacyProvider";

export function MonthlyCostCompareTable({ plans = [], months = [], monthNumber = 0, isShowMore = false }) {
    const clonedPlans = useMemo(() => {
        const copyPlans = [...plans];
        if (plans.length < 3) {
            copyPlans.push(null);
        }
        return copyPlans;
    }, [plans]);

    const { selectedPharmacy } = usePharmacyContext();

    const calculateEffectiveMonthlyCosts = (planData, index) => {
        const pharmacyCosts = selectedPharmacy?.pharmacyId
            ? planData?.pharmacyCosts?.find((rx) => rx?.pharmacyId == selectedPharmacy?.pharmacyId)
            : planData?.pharmacyCosts?.find((rx) => rx?.pharmacyType === 2 || rx?.isMailOrder);

        const effectiveMonthlyCosts =
            planData?.pharmacyCosts?.length > 0
                ? pharmacyCosts?.monthlyCosts?.filter(
                    (mc) => mc?.monthID <= 12 - parseInt(monthNumber),
                )
                : [];

        const costDetails = effectiveMonthlyCosts?.map((mc) => {
            const totalDrugCost =
                mc?.costDetail?.reduce((acc, curr) => {
                    return curr.memberCost + acc;
                }, 0) || 0;
            const premium = planData?.annualPlanPremium / 12 || 0;
            const totalEstimatedCost = totalDrugCost + premium;

            const data = mc.costDetail?.map((cd) => {
                const cdd = { labelName: cd.labelName };
                cdd[`memberCost`] = currencyFormatter.format(cd.memberCost);
                return cdd;
            });

            return {
                costPhases: mc?.costPhases,
                monthID: mc?.monthID,
                totalDrugCost: currencyFormatter.format(totalDrugCost),
                totalEstimatedCost: currencyFormatter.format(totalEstimatedCost),
                monthlyCostDetails: data,
                plan: index,
                premium: currencyFormatter.format(premium),
            };
        });

        return costDetails;
    };

    // Generate table data based on plans and effective monthly costs
    const plansData = () => {
        return clonedPlans.map((plan, planIndex) => {
            return calculateEffectiveMonthlyCosts(plan, planIndex);
        });
    };

    const transformData = (originalData) => {
        return originalData.reduce((acc, currentPlan) => {
            const { monthlyCostDetails, monthID, costPhases, totalDrugCost, totalEstimatedCost, plan } = currentPlan;

            monthlyCostDetails?.forEach(({ labelName, memberCost }) => {
                const existingRecord = acc.find(
                    (record) => record.labelName === labelName && record.monthID === monthID,
                );

                if (existingRecord) {
                    existingRecord[`plan${plan}`] = memberCost;
                } else {
                    acc.push({
                        costPhases,
                        monthID,
                        labelName,
                        [`plan${plan}`]: memberCost,
                        totalDrugCost,
                        totalEstimatedCost,
                    });
                }
            });

            return acc;
        }, []);
    };

    const convertList = (initialList) => {
        const aggregatedData = {
            labelName: (
                <div>
                    <span>Premium</span>
                    <span>Drug Cost</span>
                    <span>Total Monthly Estimated Cost</span>
                </div>
            ),
            plan: initialList[0]?.plan || 0,
        };

        initialList.forEach((item) => {
            const planKey = `plan${item.plan}`;
            const totalCost = (
                <>
                    <div>{item.premium}</div>
                    <div>{`+ ${item.totalDrugCost}`}</div>
                </>
            );
            const total = item.totalEstimatedCost;

            aggregatedData[planKey] = (
                <div>
                    {totalCost}
                    <div>{` = ${total}`}</div>
                </div>
            );
        });

        return [aggregatedData];
    };

    const showMonths = months.slice(monthNumber - 1, 12);

    const [expandedMonths, setExpandedMonths] = useState({});
    const [showMore, setShowMore] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const monthlyPrescriptionDetailsColumns = React.useMemo(
        () => [
            { Header: "Prescription", accessor: "labelName" },
            { Header: "Cost", accessor: "plan0" },
            { Header: "Cost", accessor: "plan1" },
            { Header: "Cost", accessor: "plan2" },
        ],
        [],
    );

    const showMonthlyBars = () => {
        return showMonths?.map((month, MIndex) => {
            const className = expandedMonths[MIndex] ? "cost-monthly-bar active" : "cost-monthly-bar";

            const alldata = plansData().flat();

            const filterData = alldata.filter((data) => {
                return data?.monthID === MIndex;
            });

            const drugCostsConvertList = convertList(filterData);

            const monthtransformData = transformData(filterData);

            const totalData = monthtransformData.concat(drugCostsConvertList);

            return (
                <div
                    className={className}
                    key={months[MIndex]}
                    onClick={(e) => {
                        e.stopPropagation();
                        const newExpandedMonths = { ...expandedMonths };
                        newExpandedMonths[MIndex] = Boolean(!expandedMonths[MIndex]);
                        setExpandedMonths(newExpandedMonths);
                    }}
                >
                    <div className="cost-monthly-header">
                        <div className="compare-cost-month-container">
                            {expandedMonths[MIndex] ? <ArrowDown /> : <ArrowDown className="cost-arrow-side" />}
                            <div>
                                <span className={"final-value"}>{months[MIndex + parseInt(monthNumber) - 1]}</span>
                            </div>
                        </div>
                        {!isMobile && (
                            <>
                                {filterData?.map((m, index) => (
                                    <div className="cost-monthly-header-item" key={index}>
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            <span className={"value"}>Phase:</span>{" "}
                                            <span className="costPhases">{m?.costPhases?.toLowerCase() || ""}</span>
                                        </span>
                                        <span className="value">{m?.totalEstimatedCost || ""}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <div className="cost-monthly-content">
                        <PlanDetailsTable
                            columns={monthlyPrescriptionDetailsColumns}
                            data={totalData}
                            className={"cost-monthly-table"}
                            theadClassName={"cost-monthly-thead"}
                            tbodyClassName={"cost-monthly-tbody"}
                        />
                    </div>
                </div>
            );
        });
    };

    const showPastMonthBar = () => {
        const start = monthNumber !== 1 ? months[0] : undefined;
        const previous = start && months[monthNumber - 2] ? ` - ${months[monthNumber - 2]}` : "";
        return (
            <div className="cost-monthly-bar">
                <div className="compare-cost-month-container">
                    {start + previous}
                    <span className="date">{`Effective ${months[monthNumber - 1]}`}</span>
                </div>
                {plans?.map(() => {
                    return <div className="cost-monthly-bar-item">{currencyFormatter.format("0")}</div>;
                })}
            </div>
        );
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            {isShowMore && (
                <>
                    <div
                        className="show-more-cost"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMore(!showMore);
                        }}
                    >
                        {showMore ? <ArrowDown className="cost-arrow-side" /> : <ArrowDown />}
                        <button className="show-more-cost-label">{isMobile ? "Monthly Costs" : "Show More"}</button>
                    </div>
                    {showMore && monthNumber !== "01" && <div className="cost-monthly-past">{showPastMonthBar()}</div>}
                    {showMore && <div className="cost-monthly-prescriptions">{showMonthlyBars()}</div>}
                </>
            )}
        </>
    );
}

export default MonthlyCostCompareTable;