import React from "react";
import {useTable} from "react-table";
import "./index.scss";
import PlanDetailsContactSectionCard from "packages/PlanDetailsContactSectionCard";
import {MonthlyCostTable} from "./shared/monthly-cost-table";


export default ({
                    columns,
                    data,
                    planData,
                    compareTable,
                    currencyFormatter,
                    monthNumber,
                    months,
                    className,
                    header,
                    tbodyClassName
                }) => {
    const {getTableProps, getTableBodyProps, rows, prepareRow} =
        useTable({
            columns,
            data,
            compareTable,
        });

    return (
        <>
            <PlanDetailsContactSectionCard
                title={header}
                className={"plan-details-contact-section"}
                isDashboard={true}
                preferencesKey={"costTemp_collapse"}
            >
                <table {...getTableProps()} className={`${className} plan-details-table`}>
                    <tbody {...getTableBodyProps()} className={`${tbodyClassName} plan-details-tbody`}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                className={`${compareTable && "comp-tr"}`}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            className={`${compareTable && "comp-td"}`}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <MonthlyCostTable currencyFormatter={currencyFormatter} planData={planData} monthNumber={monthNumber}
                                  months={months}/>
            </PlanDetailsContactSectionCard>
        </>
    );
};
