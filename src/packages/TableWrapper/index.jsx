import React from 'react';
import PropTypes from 'prop-types';
import MUITable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/system';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import SortArrow from 'components/icons/version-2/SortArrow';

const Centered = styled('div')`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#434A51',
    cursor: 'pointer',
    fontFamily: 'Lato',
    fontSize: '16px',
    lineHeight: '20px',
    borderBottom: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: 'Lato',
    fontSize: '16px',
    lineHeight: '20px',
    maxWidth: 250,
    color: '#434A51',
    padding: '20px 10px',
  },
}));

const StyledTableBody = styled(TableBody)(() => ({
  backgroundColor: '#FFFFFF',
}));

const SMUITable = styled(MUITable)(() => ({
  '.MuiTableCell-root ': {
    borderBottom: '1px solid #cdd0d5',
  },
}));

function Table({
  columns,
  data,
  initialState,
  fixedRows = [],
  overflowHide = false,
  handleSort,
}) {
  const table = useReactTable({
    columns,
    data,
    initialState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: overflowHide ? 'hidden' : 'auto',
      }}
    >
      <SMUITable>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <StyledTableCell
                    key={header.id}
                    onClick={() => handleSort(header.column.columnDef?.header)}
                  >
                    <Centered>
                      {flexRender(
                        header.column.columnDef?.header,
                        header.getContext()
                      )}
                      {header.column.columnDef?.enableSorting && (
                        <span
                          style={{
                            marginLeft: '8px',
                            marginTop: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <SortArrow />
                        </span>
                      )}
                    </Centered>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <StyledTableBody>
          {fixedRows.map((fixedRow, idx) => (
            <TableRow key={`fixed-${idx}`}>{fixedRow}</TableRow>
          ))}
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <StyledTableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef?.cell ?? '',
                    cell.getContext()
                  )}
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </StyledTableBody>
      </SMUITable>
    </TableContainer>
  );
}

Table.propTypes = {
  columns: PropTypes.array.isRequired, // Column configuration for the table
  data: PropTypes.array.isRequired, // Table data
  initialState: PropTypes.object, // Initial table state
  fixedRows: PropTypes.array, // Predefined fixed rows at the top
  overflowHide: PropTypes.bool, // Whether to hide horizontal overflow
};

export default Table;
