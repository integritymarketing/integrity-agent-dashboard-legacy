import React, { useMemo } from "react";
import PlanDetailsTable from "..";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default ({ planData }) => {
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
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};
