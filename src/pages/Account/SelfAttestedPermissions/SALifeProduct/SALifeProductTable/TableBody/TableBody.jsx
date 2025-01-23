import PropTypes from "prop-types";

import styles from "./styles.module.scss";

function TableBody({ getTableBodyProps, rows, prepareRow, editableRow }) {
    return (
        <tbody {...getTableBodyProps()} className={styles.customBody}>
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={i}>
                        {row.cells.map((cell) => {
                            const currentRow = row?.original?.fexAttestationId;
                            if (editableRow === currentRow) {
                                return (
                                    <td className={styles.customBodyRow} {...cell.getCellProps()}>
                                        {cell.render("EditableCell")}
                                    </td>
                                );
                            } else {
                                return (
                                    <td {...cell.getCellProps()}>
                                        <div className={styles.customBodyRow}>{cell.render("Cell")}</div>
                                    </td>
                                );
                            }
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
    editableRow: PropTypes.any,
};

export default TableBody;
