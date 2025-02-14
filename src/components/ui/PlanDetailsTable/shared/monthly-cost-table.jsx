import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ArrowDown from "../../../icons/arrow-down";
import PlanDetailsTable from "../index";
import Media from "react-media";
import { usePharmacyContext } from "providers/PharmacyProvider";

export function MonthlyCostTable({ planData, months, monthNumber, currencyFormatter, isShowMore }) {
    const { selectedPharmacy } = usePharmacyContext();
    const { pharmacyCosts } = planData;

    let selectedPharmacyCosts;

    if (Object.keys(selectedPharmacy)?.length && selectedPharmacy?.pharmacyId) {
        selectedPharmacyCosts = pharmacyCosts?.find((rx) => rx?.pharmacyID === selectedPharmacy?.pharmacyId);
    } else {
        selectedPharmacyCosts = pharmacyCosts?.find((rx) => rx?.pharmacyType === 2);
    }

    const effectiveMonthlyCosts =
        planData && pharmacyCosts?.length > 0
            ? selectedPharmacyCosts?.monthlyCosts?.filter((mc) => mc.monthID <= 12 - parseInt(monthNumber))
            : [];
    const [expandedMonths, setExpandedMonths] = useState({});
    const [showMore, setShowMore] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const monthlyPrescriptionDetailsColumns = useMemo(
        () => [
            { header: "Prescription", accessorKey: "labelName" },
            {
                header: "Cost",
                accessorKey: "memberCost",
                id: "cost-label",
                cell: ({ getValue }) => (
                    <div>
                        <span>{getValue()}</span>
                    </div>
                ),
            },
        ],
        []
    );

    const showMonthlyBars = () => {
        return effectiveMonthlyCosts?.map((mc) => {
            const className = expandedMonths[mc.monthID] ? "cost-monthly-bar active" : "cost-monthly-bar";

            const totalDrugCost =
                mc?.costDetail?.reduce((acc, curr) => {
                    return curr.memberCost + acc;
                }, 0) || 0;
            const premium = planData?.annualPlanPremium / 12;
            const totalEstimatedCost = totalDrugCost + premium;

            return (
                <div
                    className={className}
                    key={months[mc.monthID]}
                    onClick={(e) => {
                        e.stopPropagation();
                        const newExpandedMonths = { ...expandedMonths };
                        newExpandedMonths[mc.monthID] = Boolean(!expandedMonths[mc.monthID]);
                        setExpandedMonths(newExpandedMonths);
                    }}
                >
                    <div className="cost-monthly-header">
                        <div className="cost-month-container">
                            {expandedMonths[mc.monthID] ? <ArrowDown /> : <ArrowDown className="cost-arrow-side" />}
                            <div>
                                {" "}
                                <span className={"final-value"}> {months[mc.monthID + parseInt(monthNumber) - 1]}</span>
                            </div>
                        </div>
                        {!isMobile && (
                            <div className="cost-phases">
                                <span className={"value"}>Phase:</span>{" "}
                                <span className="costPhases">
                                    {mc?.costPhases === "0" ? "" : mc?.costPhases?.toLowerCase() || ""}
                                </span>
                            </div>
                        )}
                        <div className={"value"}>{currencyFormatter.format(totalEstimatedCost)}</div>
                    </div>
                    {mc?.costDetail?.length > 0 && (
                        <div className="cost-monthly-content">
                            <PlanDetailsTable
                                columns={monthlyPrescriptionDetailsColumns}
                                data={mc?.costDetail?.map((cd) => {
                                    const cdd = { ...cd };
                                    cdd.memberCost = currencyFormatter.format(cd.memberCost);
                                    return cdd;
                                })}
                                className={"cost-monthly-table"}
                                theadClassName={"cost-monthly-thead"}
                                tbodyClassName={"cost-monthly-tbody"}
                            />
                        </div>
                    )}
                    <div className="cost-monthly-prescription-total">
                        {showMonthlyTotalBar(totalDrugCost, totalEstimatedCost)}
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
                <div>
                    {start + previous} <span className="date">{`Effective ${months[monthNumber - 1]}`}</span>
                </div>
                <div>{currencyFormatter.format(0)}</div>
            </div>
        );
    };

    const showMonthlyTotalBar = (totalDrugCost, totalEstimatedCost) => {
        const finalTotal = (
            <div className={"total-line"}>
                <span className={"total-label"}>Total Monthly Estimated Cost:</span>{" "}
                <span className={"value"}>{` ${currencyFormatter.format(totalEstimatedCost)}`}</span>
            </div>
        );

        return (
            <>
                <div className="cost-total">
                    <div className={"total-line"}>
                        <span className={"total-label"}>Premium</span>{" "}
                        <span className={"value"}>
                            {` ${currencyFormatter.format(planData.annualPlanPremium / 12)}`}
                        </span>
                    </div>
                    <span className={"operator value"}>+</span>
                    <div className={"total-line"}>
                        <span className={"total-label"}>Drug Cost</span>{" "}
                        <span className={"value"}>{` ${currencyFormatter.format(totalDrugCost || 0)}`}</span>
                    </div>
                    {isMobile ? <></> : <span className={"operator value"}>=</span>}
                    {!isMobile && <div>{finalTotal}</div>}
                </div>
                {isMobile && <div>{finalTotal}</div>}
            </>
        );
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(matches) => {
                    setIsMobile(matches);
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

MonthlyCostTable.propTypes = {
    planData: PropTypes.object,
    months: PropTypes.array,
    monthNumber: PropTypes.string,
    currencyFormatter: PropTypes.object,
    isShowMore: PropTypes.bool,
};

export default MonthlyCostTable;
