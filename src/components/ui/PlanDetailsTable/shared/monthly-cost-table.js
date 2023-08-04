import React, { useState } from "react";
import ArrowDown from "../../../icons/arrow-down";
import PlanDetailsTable from "../index";
import Media from "react-media";

export function MonthlyCostTable({
  planData,
  months,
  monthNumber,
  currencyFormatter,
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
                <ArrowDown style={{ transform: "rotate(270deg)" }} />
              )}
              <div>
                {" "}
                <span className={"final-value"}> {months[mc.monthID]}</span>
              </div>
            </div>
            {!isMobile && (
              <div>
                <span className={"value"}>Phase:</span>{" "}
                <span className="costPhases">{mc.costPhases}</span>
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
          {start + previous} <i>{"Effective " + months[monthNumber - 1]}</i>
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
      <div className="show-more-cost">
        {showMore ? (
          <div style={{ transform: "rotate(180deg)" }}>
            <ArrowDown />
          </div>
        ) : (
          <ArrowDown />
        )}
        <button
          className="show-more-cost-label"
          onClick={(e) => {
            e.stopPropagation();
            setShowMore(!showMore);
          }}
        >
          {isMobile ? "Monthly Costs" : "Show More"}
        </button>
      </div>
      {showMore && (
        <div className="cost-monthly-past">{showPastMonthBar()}</div>
      )}
      {showMore && (
        <div className="cost-monthly-prescriptions">{showMonthlyBars()}</div>
      )}
    </>
  );
}
