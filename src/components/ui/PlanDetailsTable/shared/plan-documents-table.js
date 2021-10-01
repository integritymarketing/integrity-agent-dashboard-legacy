import React, { useMemo } from "react";
import PlanDetailsTable from "..";

export default ({ planData }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Plan Documents",
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
  const data = [];
  if (planData.documents && Array.isArray(planData.documents)) {
    planData.documents.forEach((document) => {
      data.push({
        label: <span className={"label"}>{document.name}</span>,
        value: (
          <a className={"link"} href={document.url}>
            {document.linkName}
          </a>
        ),
      });
    });
  }

  return (
    <>
      <PlanDetailsTable columns={columns} data={data} />
    </>
  );
};
