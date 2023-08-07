import React, { useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const PlanDocumentsTable = ({ planData }) => {
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
      <PlanDetailsTableWithCollapse
        columns={columns}
        data={data}
        header="Plan Documents"
        compareTable={true}
      />
    </>
  );
};

export default PlanDocumentsTable;
