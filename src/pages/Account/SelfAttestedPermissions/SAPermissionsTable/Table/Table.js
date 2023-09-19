import { useSortBy, useTable } from "react-table";

import { TableHeader } from "../TableHeader";
import { TableBody } from "../TableBody";
import { SAAddPermissionForm } from "../../SAAddPermissionForm";

import styles from "./styles.module.scss";

function Table({ columns, data, isAdding }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <div>
      <table className={styles.customTable} {...getTableProps()}>
        <TableHeader headerGroups={headerGroups} />
        <SAAddPermissionForm isAdding={isAdding}/>
        <TableBody
          getTableBodyProps={getTableBodyProps}
          rows={rows}
          prepareRow={prepareRow}
        />
      </table>
    </div>
  );
}

export default Table;
