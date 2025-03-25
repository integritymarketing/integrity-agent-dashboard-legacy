import React, { useState, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import { useContactsListContext } from 'pages/ContactsList/providers/ContactsListProvider';
import { useContactsListModalContext } from '../../providers/ContactsListModalProvider';

import { TableHeader } from '../TableHeader';
import { TableBody } from '../TableBody';
import styles from './styles.module.scss';

const Table = ({ isLoading = false, columns, errorCode }) => {
  const { setSelectedContacts, tableData } = useContactsListContext();
  const { isExportSuccess } = useContactsListModalContext();
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const handleSortingChange = useCallback(setSorting, []);
  const handleRowSelectionChange = useCallback(setRowSelection, []);

  const memoizedTableData = React.useMemo(() => tableData, [tableData]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const tableInstance = useReactTable({
    data: memoizedTableData,
    columns: memoizedColumns,
    state: { sorting, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    manualPagination: true,
  });
  useEffect(() => {
    const selectedContacts = tableInstance
      .getSelectedRowModel()
      .flatRows.map(row => row.original?.leadsId)
      .filter(Boolean);

    setSelectedContacts(selectedContacts);
  }, [rowSelection, tableInstance, setSelectedContacts]);

  useEffect(() => {
    setRowSelection({});
  }, [tableData, isExportSuccess]);

  return (
    <table className={styles.customTable}>
      <TableHeader headerGroups={tableInstance.getHeaderGroups()} />
      <TableBody
        rows={tableInstance.getRowModel().rows}
        isLoading={isLoading}
        errorCode={errorCode}
      />
    </table>
  );
};

Table.propTypes = {
  isLoading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Table;
