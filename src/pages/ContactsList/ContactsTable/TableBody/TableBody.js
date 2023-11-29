import PropTypes from "prop-types";

import styles from "./styles.module.scss";

function TableBody({ getTableBodyProps, rows, prepareRow }) {
    return (
        <tbody {...getTableBodyProps()} className={styles.customBody}>
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={i}>
                        {row.cells.map((cell, key) => {
                            return (
                                <td {...cell.getCellProps()} key={key}>
                                    <div className={styles.customBodyRow}>{cell.render("Cell")}</div>
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}

TableBody.propTypes = {
    getTableBodyProps: PropTypes.func,
    rows: PropTypes.array,
    prepareRow: PropTypes.func,
};

export default TableBody;
