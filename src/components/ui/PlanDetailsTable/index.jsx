import PropTypes from "prop-types";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import "./index.scss";

const PlanDetailsTable = ({ columns, data = [], compareTable, className, theadClassName, tbodyClassName }) => {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(), // Required in v8
    });

    return (
        <table className={`${className} plan-details-table`}>
            {/* Table Header */}
            <thead className={`${theadClassName} plan-details-thead`}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((column) =>
                            column.columnDef?.hideHeader ? null : ( // Fix: Check columnDef existence
                                <th key={column.id}>{flexRender(column.columnDef?.header, column.getContext())}</th>
                            )
                        )}
                    </tr>
                ))}
            </thead>

            {/* Table Body */}
            <tbody className={`${tbodyClassName} plan-details-tbody`}>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={`${compareTable ? "comp-tr" : ""}`}>
                        {row.getVisibleCells().map((cell) =>
                            cell.column.columnDef?.hideHeader ? null : ( // Fix: Hide cell if header is hidden
                                <td key={cell.id} className={`${compareTable ? "comp-td" : ""}`}>
                                    {flexRender(cell.column.columnDef?.cell, cell.getContext())}
                                </td>
                            )
                        )}
                    </tr>
                ))}
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
