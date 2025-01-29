import PropTypes from "prop-types";
// import { useTable } from "react-table";
import {useReactTable} from "@tanstack/react-table"; // TODO: react-table migration
import "./index.scss";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";

const PlanDetailsTableWithCollapse = ({columns, data, compareTable, className, header, tbodyClassName, actions}) => {
    const {getTableProps, getTableBodyProps, rows, prepareRow} = useReactTable({
        columns,
        data,
    });

    return (
        <PlanDetailsContactSectionCard
            title={header}
            className="plan-details-contact-section"
            isDashboard={true}
            preferencesKey="costTemp_collapse"
            actions={actions}
            isEmpty={data?.length === 0}
        >
            {data?.length > 0 && (
                <table {...getTableProps()} className={`${className} plan-details-table`}>
                    <tbody {...getTableBodyProps()} className={`${tbodyClassName} plan-details-tbody`}>
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr
                                key={`${header}-row-${rowIndex}`}
                                {...row.getRowProps()}
                                className={compareTable ? "comp-tr" : ""}
                            >
                                {row.cells.map((cell, cellIndex) => (
                                    <td
                                        key={`${header}-cell-${cellIndex}`}
                                        {...cell.getCellProps()}
                                        className={compareTable ? "comp-td" : ""}
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </PlanDetailsContactSectionCard>
    );
};

PlanDetailsTableWithCollapse.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
        }),
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
