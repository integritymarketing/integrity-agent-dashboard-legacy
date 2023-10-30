import React, { useMemo } from "react";
import APIFail from "./APIFail/index";
import Prescription, { currencyFormatter } from "./prescription";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";
import { useParams } from "react-router-dom";
import "./prescription.scss";

const EstimatedCost = ({ data }) => {
  if (!data || !data?.cost) {
    return null;
  }

  return (
    <div className="prescription-container">
      <div className="row footer">
        <div className="col field">
          <div className="title">Estimate Drug Cost</div>
          <div className="sub-title">
            Based on both Medical Premium & Drug Premium when applicable
          </div>
        </div>
        {data.cost.map((val) => (
          <div className="col val">
            <div className="cost">{currencyFormatter.format(val)}</div>
            <div className="duration">{data.startMonth} - Dec</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderCell = (value, rowIndex, totalRows, prescriptions) => {
  if (rowIndex === totalRows - 1) {
    return <EstimatedCost data={value} />;
  }
  return <Prescription data={value} prescriptions={prescriptions} />;
};

const getTableData = (plans = [], prescriptions = [], startMonth) => {
  const rows = [];
  for (let i = 0, len = prescriptions.length; i < len; i++) {
    const planDrugCoverage = plans[0]?.planDrugCoverage[i];
    rows[i] = {
      data: {
        gap: [],
        copay: [],
        covered: [],
        deductible: [],
        restrictions: [],
        catastrophic: [],
        drugName: planDrugCoverage.labelName,
        type: planDrugCoverage.tierDescription || "Non-Preferred Drug",
      },
    };
    plans.forEach(({ pharmacyCosts } = {}, planIndex) => {
      const currentDrugCoverage = plans[planIndex]?.planDrugCoverage[i];
      const rowData = rows[i].data;
      const costs = pharmacyCosts?.[0]?.drugCosts?.[i] || {};

      rowData.gap[planIndex] = costs.gap;
      rowData.copay[planIndex] = costs.beforeGap;
      rowData.catastrophic[planIndex] = costs.afterGap;
      rowData.deductible[planIndex] = costs.deductible;
      rowData.restrictions[planIndex] = {
        hasPriorAuthorization: currentDrugCoverage.hasPriorAuthorization,
        hasQuantityLimit: currentDrugCoverage.hasQuantityLimit,
        hasStepTherapy: currentDrugCoverage.hasStepTherapy,
        quantityLimitAmount: currentDrugCoverage.quantityLimitAmount,
        quantityLimitDays: currentDrugCoverage.quantityLimitDays,
      };
      rowData.covered[planIndex] = currentDrugCoverage.tierNumber > 0;
    });
  }
  rows.push({
    data: {
      startMonth,
      cost: plans.map((plan) => plan.estimatedAnnualDrugCostPartialYear),
    },
  });
  return rows;
};

export function PrescriptionsCompareTable({
  plans = [],
  prescriptions = [],
  apiError,
}) {
  const isEmptyData = prescriptions?.length === 0;
  const { effectiveDate } = useParams();
  const startMonth = new Date(effectiveDate).toLocaleString("default", {
    month: "long",
  });

  const columns = useMemo(
    () => [
      {
        Header: "Prescriptions",
        columns: [
          {
            accessor: "data",
            Cell({ value, row, rows }) {
              return renderCell(value, row.index, rows.length, prescriptions);
            },
          },
        ],
      },
    ],
    [prescriptions]
  );

  const data = useMemo(
    () => getTableData(plans, prescriptions, startMonth),
    [plans, prescriptions, startMonth]
  );

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

  const emptyColumnsData = [
    {
      Header: "Prescriptions",
      columns: [
        {
          hideHeader: true,
          accessor: "empty",
        },
      ],
    },
  ];

  const rowData = [
    {
      unAvailable: <APIFail title={"Prescription"} />,
    },
  ];

  const emptyRowData = [];

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={
          apiError ? columnsData : isEmptyData ? emptyColumnsData : columns
        }
        data={apiError ? rowData : isEmptyData ? emptyRowData : data}
        compareTable={true}
        header={"Prescriptions"}
      />
    </>
  );
}
