import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@awesome.me/kit-7ab3488df1/icons/duotone/solid";

{
    /* <i class="fa-duotone fa-solid fa-spinner-third"></i>; */
}
import styles from "./styles.module.scss";

/**
 * Default function to generate row keys using the index.
 */
const defaultGetRowKey = (_row, index) => index;

function TableBody({ getTableBodyProps, rows, prepareRow, getRowKey = defaultGetRowKey, isLoading = false }) {
    return (
        <tbody {...(getTableBodyProps ? getTableBodyProps() : {})} className={styles.customBody}>
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
                rows.map((row, rowIndex) => {
                    prepareRow(row);
                    const { key: rowKey, ...rowProps } = row.getRowProps();
                    return (
                        <tr {...rowProps} key={getRowKey(row, rowIndex)}>
                            {row.cells.map((cell, cellIndex) => {
                                const { key: cellKey, ...cellProps } = cell.getCellProps();
                                return (
                                    <td {...cellProps} key={cellKey || cellIndex}>
                                        <div className={styles.customBodyRow}>{cell.render("Cell")}</div>
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })
            )}
        </tbody>
    );
}

TableBody.propTypes = {
    /** Function to get properties for the table body */
    getTableBodyProps: PropTypes.func,
    /** Array of rows to be displayed */
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    /** Function to prepare each row for rendering */
    prepareRow: PropTypes.func.isRequired,
    /** Function to generate a unique key for each row */
    getRowKey: PropTypes.func,
    /** Boolean indicating whether data is still loading */
    isLoading: PropTypes.bool,
};

TableBody.defaultProps = {
    getTableBodyProps: () => ({}),
    getRowKey: defaultGetRowKey,
    isLoading: false,
};

export default TableBody;
