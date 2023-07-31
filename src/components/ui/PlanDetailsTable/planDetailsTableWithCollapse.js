import React from "react";
import { useTable } from "react-table";
import "./index.scss";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";


export default ({ columns, data, compareTable, className, header }) => {
  const { getTableProps, getTableBodyProps, rows, prepareRow } =
    useTable({
      columns,
      data,
      compareTable,
    });

  return (
    <>
      <PlanDetailsContactSectionCard
        title={header}
        className={"planDetailsContactSection"}
        isDashboard={true}
        preferencesKey={"costTemp_collapse"}
      >
        <table {...getTableProps()} className={`${className} plan-details-table`}>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`${compareTable && "comp-tr"}`}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
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
