import React from "react";
import { useTable } from "react-table";
import "./index.scss";

function getHeader(column) {
  if (!column.hideHeader) {
    return <th {...column.getHeaderProps()}>{column.render("Header")}</th>;
  }
}

export default ({ columns, data, compareTable, className, theadClassName, tbodyClassName}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      compareTable,
    });

  return (
    <>
      <table {...getTableProps()} className={`${className} plan-details-table`}>
        <thead className={`${theadClassName} plan-details-thead`}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(getHeader)}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className={`${tbodyClassName} plan-details-tbody`}>
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
    </>
  );
};
