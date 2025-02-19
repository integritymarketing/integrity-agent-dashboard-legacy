import PropTypes from "prop-types";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import "./index.scss";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";

const PlanDetailsTableWithCollapse = ({
    columns,
    data = [],
    compareTable,
    className,
    header,
    tbodyClassName,
    actions,
}) => {
    const table = useReactTable({
        columns: columns.map((col, index) => ({
            ...col,
            id: col.id || `column-${index}`, // Ensure unique column ids
        })),
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <PlanDetailsContactSectionCard
            title={header}
            className="plan-details-contact-section"
            isDashboard={true}
            preferencesKey="costTemp_collapse"
            actions={actions}
            isEmpty={data.length === 0}
        >
            {data.length > 0 && (
                <table className={`${className} plan-details-table`}>
                    <tbody className={`${tbodyClassName} plan-details-tbody`}>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className={compareTable ? "comp-tr" : ""}>
                                {row.getVisibleCells().map((cell) =>
                                    cell.column.columnDef?.hideHeader ? null : (
                                        <td key={cell.id} className={compareTable ? "comp-td" : ""}>
                                            {cell.column.columnDef.cell
                                                ? flexRender(cell.column.columnDef.cell, cell.getContext())
                                                : flexRender(cell.getValue(), cell.getContext())}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </PlanDetailsContactSectionCard>
    );
};

PlanDetailsTableWithCollapse.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string, // Ensure id exists
            header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
            accessorKey: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    compareTable: PropTypes.bool,
    className: PropTypes.string,
    header: PropTypes.string.isRequired,
    tbodyClassName: PropTypes.string,
    actions: PropTypes.node,
};

PlanDetailsTableWithCollapse.defaultProps = {
    compareTable: false,
    className: "",
    tbodyClassName: "",
    actions: null,
};

export default PlanDetailsTableWithCollapse;
