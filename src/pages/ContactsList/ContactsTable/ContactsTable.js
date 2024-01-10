/* eslint-disable react/prop-types */
import { useMemo } from "react";

import Box from "@mui/material/Box";

import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import { Checkbox } from "components/ui/version-2/Checkbox";

import { ActionsCell } from "./ActionsCell";
import { NameCell } from "./NameCell";
import { StageCell } from "./StageCell";
import { Table } from "./Table";
import { TagCell } from "./TagCell";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";

function ContactsTable() {
    const columns = useMemo(
        () => [
            {
                accessor: "selection",
                disableSortBy: true,
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <Checkbox {...getToggleAllRowsSelectedProps()} indeterminate={false} />
                ),
                Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
            },
            {
                Header: "Name",
                accessor: "firstName",
                Cell: ({ row }) => <NameCell row={row} />,
            },
            {
                Header: "Stage",
                disableSortBy: true,
                accessor: "statusName",
                Cell: ({ value, row }) => <StageCell initialValue={value} originalData={row?.original} />,
            },
            {
                Header: "Tags",
                disableSortBy: true,
                accessor: (row) => <TagCell row={row} />,
            },
            {
                Header: "Life",
                disableSortBy: true,
                accessor: "lifePolicyCount",
                Cell: ({ value }) => {
                    if (value === 0 || !value) {
                        return <HeartInactive />;
                    } else {
                        return (
                            <Box position="relative" display="inline-block">
                                <Heartactive />
                                {value > 1 && <Box className={styles.count}>{value}</Box>}
                            </Box>
                        );
                    }
                },
            },
            {
                Header: "Health",
                disableSortBy: true,
                accessor: "healthPolicyCount",
                Cell: ({ value }) => {
                    if (value === 0 || !value) {
                        return <HealthInactive />;
                    } else {
                        return (
                            <Box position="relative" display="inline-block">
                                <HealthActive />
                                {value > 1 && <Box className={styles.count}>{value}</Box>}
                            </Box>
                        );
                    }
                },
            },
            {
                Header: "",
                disableSortBy: true,
                accessor: "actions",
                Cell: ({ row }) => <ActionsCell row={row} />,
            },
        ],
        []
    );

    return (
        <Box className={styles.tableWrapper}>
            <Table columns={columns} />
            <LoadMoreButton />
        </Box>
    );
}

export default ContactsTable;
