import React, { useState } from "react";
import PropTypes from "prop-types";
import ArrowDown from "../../../icons/arrow-down";
import PlanDetailsTable from "../index";
import Media from "react-media";

export function MonthlyCostTable({
  planData,
  months,
  monthNumber,
  currencyFormatter,
  isShowMore,
}) {
  const effectiveMonthlyCosts =
    planData && planData.pharmacyCosts?.length > 0
      ? planData.pharmacyCosts[0].monthlyCosts?.filter(
          (mc) => mc.monthID >= parseInt(monthNumber) - 1
        )
      : [];
  const [expandedMonths, setExpandedMonths] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const monthlyPrescriptionDetailsColumns = React.useMemo(
    () => [
      { Header: "Prescription", accessor: "labelName" },
      { Header: "Cost", accessor: "memberCost" },
    ],
    []
  );

  const showMonthlyBars = () => {
    return effectiveMonthlyCosts?.map((mc) => {
      const className = expandedMonths[mc.monthID]
        ? "cost-monthly-bar active"
        : "cost-monthly-bar";
      return (
        <div
          className={className}
          key={months[mc.monthID]}
          onClick={(e) => {
            e.stopPropagation();
            const newExpandedMonths = { ...expandedMonths };
            newExpandedMonths[mc.monthID] = !!!expandedMonths[mc.monthID];
            setExpandedMonths(newExpandedMonths);
          }}
        >
          <div className="cost-monthly-header">
            <div className="cost-month-container">
              {expandedMonths[mc.monthID] ? (
                <ArrowDown />
              ) : (
                <ArrowDown className="cost-arrow-side" />
              )}
              <div>
                {" "}
                <span className={"final-value"}> {months[mc.monthID]}</span>
              </div>
            </div>
            {!isMobile && (
              <div className="cost-phases">
                <span className={"value"}>Phase:</span>{" "}
                <span className="costPhases">
                  {mc.costPhases.toLowerCase()}
                </span>
              </div>
            )}
            <div className={"value"}>
              {currencyFormatter.format(
                planData.annualPlanPremium / 12 + mc.totalMonthlyCost
              )}
            </div>
          </div>
          <div className="cost-monthly-content">
            <PlanDetailsTable
              columns={monthlyPrescriptionDetailsColumns}
              data={mc.costDetail?.map((cd) => {
                const cdd = { ...cd };
                cdd.memberCost = currencyFormatter.format(cd.memberCost);
                return cdd;
              })}
              className={"cost-monthly-table"}
              theadClassName={"cost-monthly-thead"}
              tbodyClassName={"cost-monthly-tbody"}
            />
          </div>
          <div className="cost-monthly-prescription-total">
            {showMonthlyTotalBar(mc.totalMonthlyCost)}
          </div>
        </div>
      );
    });
  };

  const showPastMonthBar = () => {
    const start = monthNumber !== 1 ? months[0] : undefined;
    const previous =
      start && months[monthNumber - 2] ? " - " + months[monthNumber - 2] : "";
    return (
      <div className="cost-monthly-bar">
        <div>
          {start + previous}{" "}
          <span className="date">{"Effective " + months[monthNumber - 1]}</span>
        </div>
        <div>{currencyFormatter.format(0)}</div>
      </div>
    );
  };

  const showMonthlyTotalBar = (totalMonthlyCost) => {
    const finalTotal = (
      <div className={"total-line"}>
        <span className={"total-label"}>Total Monthly Estimated Cost:</span>{" "}
        <span className={"value"}>
          {" " +
            currencyFormatter.format(
              planData.annualPlanPremium / 12 + totalMonthlyCost
            )}
        </span>
      </div>
    );
    return (
      <>
        <div className="cost-total">
          <div className={"total-line"}>
            <span className={"total-label"}>Premium</span>{" "}
            <span className={"value"}>
              {" " + currencyFormatter.format(planData.annualPlanPremium / 12)}
            </span>
          </div>
          <span className={"operator value"}>+</span>
          <div className={"total-line"}>
            <span className={"total-label"}>Drug Cost</span>{" "}
            <span className={"value"}>
              {" " + currencyFormatter.format(totalMonthlyCost)}
            </span>
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
            {showMore ? (
              <ArrowDown className="cost-arrow-side" />
            ) : (
              <ArrowDown />
            )}
            <button className="show-more-cost-label">
              {isMobile ? "Monthly Costs" : "Show More"}
            </button>
          </div>
          {showMore && (
            <div className="cost-monthly-past">{showPastMonthBar()}</div>
          )}
          {showMore && (
            <div className="cost-monthly-prescriptions">
              {showMonthlyBars()}
            </div>
          )}
        </>
      )}
    </>
  );
}
MonthlyCostTable.propTypes = {
  planData: PropTypes.object,
  months: PropTypes.array,
  monthNumber: PropTypes.number,
  currencyFormatter: PropTypes.object,
  isShowMore: PropTypes.bool,
};

export default MonthlyCostTable;
