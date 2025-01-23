import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PlanBenefitsTable = ({ planData }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Plan Benefits",
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
      label: <span className={"label"}>Medical Deductible</span>,
      value: (
        <span className={"value"}>
          {currencyFormatter.format(planData.medicalDeductible)}
        </span>
      ),
    },
    {
      label: <span className={"label"}>In-Network Maximum out of Pocket</span>,
      value: (
        <span className={"value"}>
          {currencyFormatter.format(planData.maximumOutOfPocketCost)}
        </span>
      ),
    },
  ];

  if (planData.planDataFields && Array.isArray(planData.planDataFields)) {
    planData.planDataFields.forEach((dataField) => {
      data.push({
        label: <span className={"label"}>{dataField.name}</span>,
        value: (
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: dataField.description }}
          />
        ),
      });
    });
  }

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={data}
        className="plan-benfits"
        header="Plan Benefits"
        compareTable={true}
      />
    </>
  );
};

export default PlanBenefitsTable;
