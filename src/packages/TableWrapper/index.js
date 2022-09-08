import React, { useState } from "react";
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
import Media from "react-media";

const Centered = styled("div")`
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
    borderBottom: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: "Lato",
    fontSize: "16px",
    lineHeight: "20px",
    maxWidth: 250,
    cursor: "pointer",
    color: "#434A51",
  },
}));

const StyledTableBody = styled(TableBody)(()  => ({
  backgroundColor: "#FFFFFF",
}));

const SMUITable = styled(MUITable)(()  => ({
  ".MuiTableBody-root tr:first-child" : {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
},
  ".MuiTableBody-root tr:first-child td:first-child" : {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'initial',
  },
  ".MuiTableBody-root tr:first-child td:last-child" : {
    borderTopLeftRadius: 'initial',
    borderTopRightRadius: 'inherit',
  },
".MuiTableBody-root tr:last-child": {
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px'
},
  ".MuiTableBody-root tr:last-child td:first-child" : {
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'initial',
  },
  ".MuiTableBody-root tr:last-child td:last-child" : {
    borderBottomLeftRadius: 'initial',
    borderBottomRightRadius: 'inherit',
  },
}));

const StyledTableRow = styled(TableRow)(({ isLast }) => ({
  background: "#2175F41A 0% 0% no-repeat padding-box",
  boxShadow: isLast ? "inset 0px -1px 0px #C7CCD1" : "none"
}));

const generateSortingIndicator = (column) => {
  if (column.canSort === false) {
    return null;
  }
  if (column.isSorted === false) {
    return <Sort />;
  }
  if (column.isSortedDesc) {
    return <SortArrowDown />;
  }
  return <SortArrowUp />;
};

function Table({ columns, data, footer, initialState, fixedRows = [] }) {
  // Use the state and functions returned from useTable to build the UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useSortBy
  );
  const [isMobile, setIsMobile] = useState(false);

  // Render the UI for table
  return (
    <TableContainer>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <SMUITable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <StyledTableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Centered>
                    {column.render("Header")} {generateSortingIndicator(column)}
                  </Centered>
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <StyledTableBody>
          {fixedRows.map((fixedRow, idx) => (
            <StyledTableRow key={idx} bg="true" isLast={idx === fixedRows}>
              {fixedRow}
            </StyledTableRow>
          ))}

          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <StyledTableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </StyledTableBody>
        {footer ? (
          <TableFooter>
            <TableRow>
              <TableCell
                style={{ border: "none" }}
                colSpan={isMobile ? 3 : columns.length}
              >
                <center style={isMobile ? { marginLeft: -100 } : {}}>
                  {footer}
                </center>
              </TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </SMUITable>
    </TableContainer>
  );
}

export default Table;
