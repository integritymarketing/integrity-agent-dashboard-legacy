import React, { useMemo } from "react";
import { parseDate } from "utils/dates";
import PlanDetailsTable from "..";
import { useParams } from "react-router-dom";
import InNetworkCheck from "components/icons/in-network-check";
import OutNetworkX from "components/icons/out-network-x";
import APIFail from "./APIFail/index";

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

function renderData(
  prescriptionMap,
  labelName,
  effectiveDateString,
  isFullYear
) {
  return (
    <>
      {getCoveredCheck(prescriptionMap[labelName].isCovered)}
      <span className={"label comp-pres-label"}>
        {currencyFormatter.format(prescriptionMap[labelName].cost)}{" "}
        <span className="per">{isFullYear ? "/year" : "/partial year"}</span>
      </span>
      <span className={"subtext"}>
        Estimate based on an effective date {effectiveDateString}
      </span>
    </>
  );
}

function buildPrescription({ planData, monthsRemaining }) {
  const pharmacyCost = planData?.pharmacyCosts
    ? planData?.pharmacyCosts[0]
    : {};

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
    for (var i = 0; i <= monthsRemaining; i++) {
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

export function PrescriptionsCompareTable({
  plans,
  prescriptions,
  isFullYear,
}) {
  const clonedPlans = useMemo(() => {
    const copyPlans = [...plans];
    if (plans.length < 3) {
      copyPlans.push(null);
    }
    return copyPlans;
  }, [plans]);

  const isApiFailed =
    (prescriptions?.filter((drug) => drug.dosageDetails?.labelName)?.length > 0
      ? false
      : true) &&
    prescriptions !== null &&
    prescriptions?.length > 0;

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
                effectiveDateString,
                isFullYear
              );
            },
          })),
        ],
      },
    ],
    [clonedPlans, effectiveDateString, isFullYear]
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

  const uniqPres = [...new Set(allPrescriptions)];

  const data = Object.values(uniqPres).map((labelName, index) => ({
    labelName,
    "plan-0": { labelName, prescriptionMap: allPrescriptionsMap[0] },
    "plan-1": { labelName, prescriptionMap: allPrescriptionsMap[1] },
    "plan-2": { labelName, prescriptionMap: allPrescriptionsMap[2] },
  }));

  const columnsData = [
    {
      Header: "Prescriptions",
      columns: [
        {
          hideHeader: true,
          accessor: "unAvailable",
        },
      ],
    },
  ];

  const rowData = [
    {
      unAvailable: <APIFail title={"Prescription"} />,
    },
  ];

  return (
    <>
      <PlanDetailsTable
        columns={isApiFailed ? columnsData : columns}
        data={isApiFailed ? rowData : data}
        compareTable={true}
      />
    </>
  );
}
