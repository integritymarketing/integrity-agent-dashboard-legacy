import React from "react";
import { flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@awesome.me/kit-7ab3488df1/icons/duotone/solid";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const TableBody = ({ rows, isLoading }) => {
    return (
        <tbody className={styles.customBody}>
            {isLoading ? (
                <tr>
                    <td colSpan={100} className={styles.loading}>
                        <div className={styles.loaderContainer}>
                            <FontAwesomeIcon
                                icon={faSpinnerThird}
                                color="#4178FF"
                                secondaryColor="#C4C8CF"
                                size="10x"
                                spin
                                secondaryOpacity={0.5}
                            />
                        </div>
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
