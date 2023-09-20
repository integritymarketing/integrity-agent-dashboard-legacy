import PropTypes from "prop-types";
import { useSortBy, useTable } from "react-table";

import { TableHeader } from "../TableHeader";
import { TableBody } from "../TableBody";
import { SAAddPermissionForm } from "../../SAAddPermissionForm";

import styles from "./styles.module.scss";

function Table({
  columns,
  data,
  isAdding,
  handleCancel,
  handleAddNew,
  agents,
}) {
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
      <SAAddPermissionForm
        isAdding={isAdding}
        handleCancel={handleCancel}
        handleAddNew={handleAddNew}
        agents={agents}
      />
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
  isAdding: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleAddNew: PropTypes.func,
  agents: PropTypes.array,
};

export default Table;
