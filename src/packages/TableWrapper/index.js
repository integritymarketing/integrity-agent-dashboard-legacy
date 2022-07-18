import React from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/system";
import { useTable, useSortBy } from "react-table";
import Sort from "components/icons/sort-arrow";
import SortArrowUp from "components/icons/sort-arrow-up";
import SortArrowDown from "components/icons/sort-arrow-down";

const Centered = styled('div')`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.table.headerColor,
    cursor: "pointer",
    fontFamily: "Lato",
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: " 20px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: "Lato",
    fontSize: "14px",
    lineHeight: "20px",
    maxWidth: 360,
    cursor: "pointer"
  },
}));

const StyledTableRow = styled(TableRow)(({theme})=> ({
  backgroundColor: 'white'
}));

const generateSortingIndicator = (column) => {
  if (column.canSort === false) {
    return null;
  }
  if (column.isSorted === false) {
    return <Sort />
  }
  if (column.isSortedDesc) {
    return <SortArrowDown />
  }
  return <SortArrowUp />
};

function Table({ columns, data, footer, initialState }) {
  // Use the state and functions returned from useTable to build the UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState
    },
    useSortBy
  );

  // Render the UI for table
  return (
    <TableContainer>
      <MUITable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <StyledTableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Centered>
                    {column.render("Header")} {' '}
                    {generateSortingIndicator(column)}
                  </Centered>
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <StyledTableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <StyledTableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            );
          })}
        </TableBody>
        {footer ? (
          <TableFooter>
            <StyledTableRow>
              <TableCell colSpan={columns.length}>
                <center>{footer}</center>
              </TableCell>
            </StyledTableRow>
          </TableFooter>
        ) : null}
      </MUITable>
    </TableContainer>
  );
}

export default Table;
