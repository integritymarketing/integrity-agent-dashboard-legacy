import React from "react";
import { flexRender } from "@tanstack/react-table";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const TableBody = ({ rows, isLoading }) => {
    return (
        <tbody className={styles.customBody}>
            {isLoading ? (
                <tr>
                    <td colSpan={100} className={styles.loading}>
                        <div className={styles.loaderContainer}>Loading...</div>
                    </td>
                </tr>
            ) : (
                rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className={styles.customBodyRow}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
    );
};

TableBody.propTypes = {
    rows: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
};

export default TableBody;
