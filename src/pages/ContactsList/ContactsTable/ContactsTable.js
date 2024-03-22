/* eslint-disable max-lines-per-function */
/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { useWindowSize } from "hooks/useWindowSize";
import DeleteLeadContext from "contexts/deleteLead";
import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";

import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import CampaignStatus from "components/icons/version-2/CampaignStatus";
import Connectemail from "components/icons/version-2/ConnectEmail";
import { Checkbox } from "components/ui/version-2/Checkbox";

import clientsService from "services/clientsService";

import { ActionsCell } from "./ActionsCell";
import { NameCell } from "./NameCell";
import { StageCell } from "./StageCell";
import { Table } from "./Table";
import { TagCell } from "./TagCell";
import { TableMobile } from "./TableMobile";

import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { Reminder } from "components/icons/version-2/Reminder";

function ContactsTable() {
    const { tableData, policyCounts } = useContactsListContext();
    const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } = useContext(DeleteLeadContext);
    const { width: windowWidth } = useWindowSize();
    const { fireEvent } = useAnalytics();
    const navigate = useNavigate();
    const showToast = useToast();
    const isMobile = windowWidth <= 784;

    const contactsListResultsEvent = () => {
        const contacts_with_health_policies_count = policyCounts.filter(
            (contact) => contact.healthPolicyCount > 0
        ).length;
        const contacts_with_life_policies_count = policyCounts.filter((contact) => contact.lifePolicyCount > 0).length;

        const contacts_without_policies_count = tableData?.length - policyCounts?.length;

        fireEvent("Contact List Viewed", {
            contacts_with_health_policies_count: contacts_with_health_policies_count,
            contacts_without_policies_count: contacts_without_policies_count,
            contacts_with_life_policies_count: contacts_with_life_policies_count,
            total_contacts_count: tableData?.length,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            contactsListResultsEvent();
        }, 5000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyCounts]);

    const deleteContact = useCallback(() => {
        if (deleteLeadId !== null) {
            const clearTimer = () =>
                setTimeout(() => {
                    clearContext();
                }, 10000);
            clearTimer();
            const clearContext = () => {
                setDeleteLeadId(null);
                setLeadName(null);
            };
            const unDODelete = async () => {
                const response = await clientsService.reActivateClients([deleteLeadId]);
                if (response.ok) {
                    clearContext();
                    navigate(`/contact/${deleteLeadId}/overview`);
                } else if (response.status === 400) {
                    showToast({
                        type: "error",
                        message: "Error while reactivating contact",
                    });
                }
            };

            showToast({
                type: "success",
                message: `${leadName} Deleted`,
                time: 10000,
                link: "UNDO",
                onClickHandler: unDODelete,
                closeToastRequired: true,
                onCloseCallback: clearContext,
            });
        }
    }, [deleteLeadId, showToast, leadName, setDeleteLeadId, setLeadName, navigate]);

    useEffect(() => {
        deleteContact();
    }, [deleteLeadId, deleteContact]);

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
                Header: "Reminders",
                disableSortBy: true,
                accessor: "reminders",
                Cell: ({ value }) => {
                    return (
                        <Box position="relative" display="inline-block">
                            <Reminder />
                        </Box>
                    );
                },
            },
            {
                Header: "Campaign",
                disableSortBy: true,
                accessor: "campaign",
                Cell: ({ value }) => {
                    return (
                        <Box position="relative" display="inline-block">
                            <CampaignStatus />
                        </Box>
                    );
                },
            },
            {
                Header: "Ask Integrity",
                disableSortBy: true,
                accessor: "askIntegrity",
                Cell: ({ value }) => {
                    return (
                        <Box position="relative" display="inline-block">
                            <AskIntegrity />
                        </Box>
                    );
                },
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
                                {/* {value > 1 && <Box className={styles.count}>{value}</Box>} */}
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
                                {/* {value > 1 && <Box className={styles.count}>{value}</Box>} */}
                            </Box>
                        );
                    }
                },
            },
            {
                Header: "Connect",
                disableSortBy: true,
                accessor: "connect",
                Cell: ({ value }) => {
                    return (
                        <Box position="relative" display="inline-block">
                            <Connectemail />
                        </Box>
                    );
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
        <>
            {isMobile ? (
                <TableMobile />
            ) : (
                <Box className={styles.tableWrapper}>
                    <Table columns={columns} />
                    <LoadMoreButton />
                </Box>
            )}
        </>
    );
}

export default ContactsTable;