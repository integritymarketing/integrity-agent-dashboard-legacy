/* eslint-disable react/prop-types */
import { useMemo } from "react";

import Box from "@mui/material/Box";

import HealthInactive from "components/icons/version-2/HealthInactive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import Checkbox from "components/ui/Checkbox";

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
                Header: ({ getToggleAllRowsSelectedProps }) => <Checkbox {...getToggleAllRowsSelectedProps()} />,
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
                Header: "Tag",
                disableSortBy: true,
                accessor: (row) => <TagCell row={row} />,
            },
            {
                Header: "Life",
                disableSortBy: true,
                accessor: "life",
                Cell: () => <HeartInactive />,
            },
            {
                Header: "Health",
                disableSortBy: true,
                accessor: "health",
                Cell: () => <HealthInactive />,
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
