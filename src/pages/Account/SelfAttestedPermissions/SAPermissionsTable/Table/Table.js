import PropTypes from "prop-types";
import { useSortBy, useTable } from "react-table";

import { TableHeader } from "../TableHeader";
import { TableBody } from "../TableBody";
import { SAAddPermissionForm } from "../../SAAddPermissionForm";

import styles from "./styles.module.scss";

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <table className={styles.customTable} {...getTableProps()}>
      <TableHeader headerGroups={headerGroups} />
      <SAAddPermissionForm />
      <TableBody
        getTableBodyProps={getTableBodyProps}
        rows={rows}
        prepareRow={prepareRow}
      />
    </table>
  );
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
};

export default Table;
