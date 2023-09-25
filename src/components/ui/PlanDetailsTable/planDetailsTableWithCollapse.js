import React from "react";
import { useTable } from "react-table";
import "./index.scss";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";

const PlanDetailsTableWithCollapse = ({
  columns,
  data,
  compareTable,
  className,
  header,
  tbodyClassName,
  actions,
}) => {
  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns,
    data,
    compareTable,
  });

  return (
    <>
      <PlanDetailsContactSectionCard
        title={header}
        className={"plan-details-contact-section"}
        isDashboard={true}
        preferencesKey={"costTemp_collapse"}
        actions={actions}
      >
        <table
          {...getTableProps()}
          className={`${className} plan-details-table`}
        >
          <tbody
            {...getTableBodyProps()}
            className={`${tbodyClassName} plan-details-tbody`}
          >
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  key={`${header}-row-${rowIndex}`}
                  {...row.getRowProps()}
                  className={`${compareTable && "comp-tr"}`}
                >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        key={`${header}-cell-${cellIndex}`}
                        {...cell.getCellProps()}
                        className={`${compareTable && "comp-td"}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </PlanDetailsContactSectionCard>
    </>
  );
};

export default PlanDetailsTableWithCollapse;
