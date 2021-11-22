import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import { useParams } from "react-router-dom";
import { parseDate } from "utils/dates";
import React, { useMemo } from "react";
import PlanDetailsTable from "..";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getCoveredCheck(isCovered) {
  if (isCovered) {
    return (
      <>
        <InNetworkCheck />
        <span className={"in-network-label"}>Covered</span>
      </>
    );
  }
  return (
    <>
      <OutNetworkX /> <span className={"in-network-label"}>Not Covered</span>
    </>
  );
}
export default ({ planData, isMobile }) => {
  const { effectiveDate } = useParams();
  const effectiveStartDate = parseDate(effectiveDate, "yyyy-MM-dd");
  const effectiveEndDate = new Date(effectiveStartDate);
  effectiveEndDate.setMonth(11);
  const monthsRemaining =
    effectiveEndDate.getMonth() - effectiveStartDate.getMonth();
  const effectiveDateString = `${effectiveStartDate.toLocaleString("default", {
    month: "long",
  })} ${effectiveStartDate.getFullYear()} `;
  const columns = useMemo(
    () => [
      {
        Header: "Prescriptions",
        columns: [
          ...(isMobile
            ? [
                {
                  hideHeader: true,
                  accessor: "name_cost",
                },
              ]
            : [
                {
                  hideHeader: true,
                  accessor: "name",
                },
                {
                  hideHeader: true,
                  accessor: "cost",
                },
              ]),
          {
            hideHeader: true,
            accessor: "covered",
          },
        ],
      },
    ],
    [isMobile]
  );
  const pharmacyCost = planData?.pharmacyCosts[0];

  const prescriptionMap = {};
  if (planData.planDrugCoverage && Array.isArray(planData.planDrugCoverage)) {
    planData.planDrugCoverage.forEach((drugCoverage) => {
      prescriptionMap[drugCoverage.labelName] = {
        isCovered: drugCoverage.tierNumber !== 0,
        cost: 0,
      };
    });
  }

  const data = [];
  if (pharmacyCost.monthlyCosts && Array.isArray(pharmacyCost.monthlyCosts)) {
    var monthlyCostLength = pharmacyCost.monthlyCosts.length;
    var startingMonth = monthlyCostLength - monthsRemaining;
    for (var i = startingMonth - 1; i < pharmacyCost.monthlyCosts.length; i++) {
      var monthlyCost = pharmacyCost.monthlyCosts[i];
      if (monthlyCost.costDetail && Array.isArray(monthlyCost.costDetail)) {
        for (var k = 0; k < monthlyCost.costDetail.length; k++) {
          var costDetail = monthlyCost.costDetail[k];
          prescriptionMap[costDetail.labelName].cost += costDetail.memberCost;
        }
      }
    }
  }
  Object.keys(prescriptionMap).forEach((labelName) => {
    const row = {
      name: <span className={"label"}>{labelName}</span>,
      cost: (
        <>
          <span className={"label"}>
            {currencyFormatter.format(prescriptionMap[labelName].cost)}{" "}
            <span className="per">/year</span>
          </span>
          <span className={"subtext"}>
            Estimate based on an effective date {effectiveDateString}
          </span>
        </>
      ),
      covered: getCoveredCheck(prescriptionMap[labelName].isCovered),
    }
    data.push({
      ...row, 
      name_cost: <><div>{row.name}</div><div>{row.cost}</div></>
    });
  });

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};
