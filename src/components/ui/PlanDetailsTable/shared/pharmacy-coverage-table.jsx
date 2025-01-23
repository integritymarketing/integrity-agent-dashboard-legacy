import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PharmacyCoverageTable = ({ planData }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Pharmacy Coverage",
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
      label: <span className={"label"}>Pharmacy Deductible</span>,
      value: (
        <span className={"value"}>
          {currencyFormatter.format(planData.drugDeductible)}
        </span>
      ),
    },
    {
      label: <span className={"label"}>Initial Coverage Limit</span>,
      value: (
        <span className={"value"}>
          {currencyFormatter.format(planData.initialCoverageLimit)}
        </span>
      ),
    },
  ];

  return (
    <>
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={data}
        header="Pharmacy Coverage"
        compareTable={true}
      />
    </>
  );
};

export default PharmacyCoverageTable;