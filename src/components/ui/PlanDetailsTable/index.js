import React from "react";
import PropTypes from "prop-types";
import { useTable } from "react-table";
import "./index.scss";

const PlanDetailsTable = ({
  columns,
  data,
  compareTable,
  className,
  theadClassName,
  tbodyClassName,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: data || [],
      compareTable,
    });

  return (
    <table {...getTableProps()} className={`${className} plan-details-table`}>
      <thead className={`${theadClassName} plan-details-thead`}>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(
              (column) =>
                !column.hideHeader && (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                )
            )}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className={`${tbodyClassName} plan-details-tbody`}
      >
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={`${compareTable ? "comp-tr" : ""}`}
            >
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  className={`${compareTable ? "comp-td" : ""}`}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

PlanDetailsTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  compareTable: PropTypes.bool,
  className: PropTypes.string,
  theadClassName: PropTypes.string,
  tbodyClassName: PropTypes.string,
};

export default PlanDetailsTable;
