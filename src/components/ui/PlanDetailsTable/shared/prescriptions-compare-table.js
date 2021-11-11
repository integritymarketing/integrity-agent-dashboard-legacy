import React, { useMemo } from "react";
import { parseDate } from "utils/dates";
import PlanDetailsTable from "..";
import { useParams } from "react-router-dom";
import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";

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

function renderData(prescriptionMap, labelName, effectiveDateString) {
  return (
    <>
      {getCoveredCheck(prescriptionMap[labelName].isCovered)}
      <span className={"label comp-pres-label"}>
        {currencyFormatter.format(prescriptionMap[labelName].cost)}{" "}
        <span className="per">/year</span>
      </span>
      <span className={"subtext"}>
        Estimate based on an effective date {effectiveDateString}
      </span>
    </>
  );
}

function buildPrescription({ planData, monthsRemaining }) {
  const pharmacyCost = planData.pharmacyCosts[0];

  const prescriptionMap = {};
  if (planData.planDrugCoverage && Array.isArray(planData.planDrugCoverage)) {
    planData.planDrugCoverage.forEach((drugCoverage) => {
      prescriptionMap[drugCoverage.labelName] = {
        isCovered: drugCoverage.tierNumber !== 0,
        cost: 0,
      };
    });
  }

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

  return prescriptionMap;
}

export function PrescriptionsCompareTable({ plans, prescriptions }) {
  const clonedPlans = useMemo(() => {
    const copyPlans = [...plans];
    if (plans.length < 3) {
      copyPlans.push(null);
    }
    return copyPlans;
  }, [plans]);

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
          {
            hideHeader: true,
            accessor: "labelName",
            Cell({ value }) {
              return (
                <div>
                  <div className="label">{value}</div>
                </div>
              );
            },
          },
          ...clonedPlans.map((plan, index) => ({
            hideHeader: true,
            accessor: `plan-${index}`,
            Cell({ value: { labelName, prescriptionMap }, original }) {
              if (!clonedPlans[index]) {
                return "-";
              }
              return renderData(
                prescriptionMap,
                labelName,
                effectiveDateString
              );
            },
          })),
        ],
      },
    ],
    [clonedPlans, effectiveDateString]
  );

  const allPrescriptions = [];
  const allPrescriptionsMap = clonedPlans.reduce((acc, plan) => {
    if (plan) {
      const map = buildPrescription({ planData: plan, monthsRemaining });
      acc.push(map);
      allPrescriptions.push(...Object.keys(map));
    }
    return acc;
  }, []);

  const data = allPrescriptions.map((labelName, index) => ({
    labelName,
    "plan-0": { labelName, prescriptionMap: allPrescriptionsMap[0] },
    "plan-1": { labelName, prescriptionMap: allPrescriptionsMap[1] },
    "plan-2": { labelName, prescriptionMap: allPrescriptionsMap[2] },
  }));

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} compareTable={true} />
    </>
  );
}
