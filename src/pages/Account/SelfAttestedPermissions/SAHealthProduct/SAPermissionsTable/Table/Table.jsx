// import { useSortBy, useTable } from "react-table"; // TODO: react-table migration
import {useReactTable} from "@tanstack/react-table";

import PropTypes from "prop-types";

import {ErrorBanner} from "pages/Account/SelfAttestedPermissions/ErrorBanner";

import styles from "./styles.module.scss";

import {SAAddPermissionForm} from "../../SAAddPermissionForm";
import {useSAHealthProductContext} from "../../providers/SAHealthProductProvider";
import {TableBody} from "../TableBody";
import {TableHeader} from "../TableHeader";

function Table({columns, data}) {
    const {error, setError} = useSAHealthProductContext();
    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, rows} = useReactTable(
        {
            columns,
            data,
        },
        // useSortBy
    );

    return (
        <table className={styles.customTable} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>
            {error && <ErrorBanner retry={() => setError(null)}/>}
            {!error && (
                <>
                    <SAAddPermissionForm/>
                    <TableBody getTableBodyProps={getTableBodyProps} rows={rows} prepareRow={prepareRow}/>
                </>
            )}
        </table>
    );
}

Table.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
};

export default Table;
