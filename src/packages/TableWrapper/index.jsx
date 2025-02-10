import React, {useState} from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import {styled} from "@mui/system";
import {useReactTable} from "@tanstack/react-table";
import Sort from "components/icons/sort-arrow";
import SortArrowUp from "components/icons/sort-arrow-up";
import SortArrowDown from "components/icons/sort-arrow-down";
import Media from "react-media";
import PropTypes from "prop-types";


const Centered = styled("div")`
    display: flex;
    gap: 5px;
    align-items: center;
`;

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        color: "#434A51",
        cursor: "pointer",
        fontFamily: "Lato",
        fontSize: "16px",
        lineHeight: " 20px",
        borderBottom: "none",
    },
    [`&.${tableCellClasses.body}`]: {
        fontFamily: "Lato",
        fontSize: "16px",
        lineHeight: "20px",
        maxWidth: 250,
        color: "#434A51",
        padding: "20px 10px",
    },
}));

const StyledTableBody = styled(TableBody)(() => ({
    backgroundColor: "#FFFFFF",
}));

const SMUITable = styled(MUITable)(() => ({
    ".MuiTableBody-root tr:first-of-type": {
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
    },
    ".MuiTableBody-root tr:first-of-type td:first-of-type": {
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "initial",
    },
    ".MuiTableBody-root tr:first-of-type td:last-child": {
        borderTopLeftRadius: "initial",
        borderTopRightRadius: "inherit",
    },
    ".MuiTableBody-root tr:last-child": {
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
    },
    ".MuiTableBody-root tr:last-child td:first-of-type": {
        borderBottomLeftRadius: "inherit",
        borderBottomRightRadius: "initial",
    },
    ".MuiTableBody-root tr:last-child td:last-child": {
        borderBottomLeftRadius: "initial",
        borderBottomRightRadius: "inherit",
    },
}));

const StyledTableRow = styled(TableRow)(({islast}) => ({
    background: "#2175F41A 0 0 no-repeat padding-box",
    boxShadow: islast ? "inset 0px -1px 0px #C7CCD1" : "none",
}));

const generateSortingIndicator = (column) => {
    if (column.canSort === false) {
        return null;
    }
    if (column.isSorted === false) {
        return <Sort/>;
    }
    if (column.isSortedDesc) {
        return <SortArrowDown/>;
    }
    return <SortArrowUp/>;
};

function Table(props) {
    const {columns, data, footer, initialState, fixedRows = [], handleSort, overflowHide = false} = props;

    const [isMobile, setIsMobile] = useState(false);

    // Use the state and functions returned from useTable to build the UI
    const {getTableProps, headerGroups, rows, prepareRow} = useReactTable({
        columns,
        data,
        initialState,
    });

    // Render the UI for table
    const style = {
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "8px",
    };
    if (overflowHide) {
        style.overflowX = "hidden";
    }
    return (
        <TableContainer sx={style}>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <SMUITable>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <StyledTableCell
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    onClick={() => handleSort(column?.Header)}
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
                        <StyledTableRow key={idx} bg="true" islast={idx === fixedRows ? 1 : 0}>
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
                            <TableCell style={{border: "none"}} colSpan={isMobile ? 3 : columns.length}>
                                <center>{footer}</center>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                ) : null}
            </SMUITable>
        </TableContainer>
    );
}

// Add PropType validation to the Table component
Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            accessor: PropTypes.string,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    footer: PropTypes.node,
    initialState: PropTypes.object,
    fixedRows: PropTypes.arrayOf(PropTypes.node),
    handleSort: PropTypes.func,
    overflowHide: PropTypes.bool,
};


export default Table;
