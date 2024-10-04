/* eslint-disable max-lines-per-function */
/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { useWindowSize } from "hooks/useWindowSize";
import DeleteLeadContext from "contexts/deleteLead";
import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import ReminderModals from "../RemiderModals/ReminderModals";
import { isOverDue } from "utils/dates";
import AskIntegrityModal from "pages/ContactsList/AskIntegrityModal/AskIntegrityModal";
import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import { Checkbox } from "components/ui/version-2/Checkbox";
import CampaignModal from "pages/ContactsList/CampaignModal/CampaignModal";
import { useClientServiceContext } from "services/clientServiceProvider";
import AddReminder from "components/icons/version-2/addReminder";

import { ActionsCell } from "./ActionsCell";
import { NameCell } from "./NameCell";
import { StageCell } from "./StageCell";
import { Table } from "./Table";
import { TableMobile } from "./TableMobile";

import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { Reminder } from "components/icons/version-2/Reminder";
import CardBadge from "../ContactsCard/CardBadge/CardBadge";
import { PoliciesProvider } from "providers/ContactDetails/PoliciesProvider";
import PolicyDetailsModal from "components/SharedModals/PolicyDetailsModal/PolicyDetailsModal";
import ConnectCall from "../ConnectCall";
import ConnectEmail from "../ConnectEmail";
import CampaignStatus from "components/icons/version-2/CampaignStatus";
import AskIntegrity from "components/icons/version-2/AskIntegrity";
import { CountyDataProvider } from "providers/CountyDataProvider";

function ContactsTable() {
    const { tableData, policyCounts, refreshData } = useContactsListContext();
    const { deleteLeadId, setDeleteLeadId, setLeadName, leadName } = useContext(DeleteLeadContext);

    const { width: windowWidth } = useWindowSize();
    const { fireEvent } = useAnalytics();
    const navigate = useNavigate();
    const showToast = useToast();

    const [showRemindersListModal, setShowRemindersListModal] = useState(false);
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);
    const [showAskIntegrityModal, setShowAskIntegrityModal] = useState(false);
    const [askIntegrityList, setAskIntegrityList] = useState(false);
    const [campaignList, setCampaignList] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const isMobile = windowWidth <= 784;
    const [leadData, setLeadData] = useState({});
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [policyDetails, setPolicyDetails] = useState({});
    const { clientsService } = useClientServiceContext();

    const openPolicyModal = (leadDataOriginal) => {
        setPolicyDetails(leadDataOriginal);
        setShowPolicyModal(true);
    };

    const remindersHandler = (remindersLength, leadDataOriginal) => {
        setLeadData(leadDataOriginal);
        if (!remindersLength) {
            setShowAddReminderModal(true);
        } else {
            setShowRemindersListModal(true);
        }
    };

    const askIntegrityHandler = (askIntegrityTags, leadDataOriginal) => {
        setLeadData(leadDataOriginal);
        setAskIntegrityList(askIntegrityTags);
        setShowAskIntegrityModal(true);
    };

    const campaignTagsHandler = (campaignTags, leadDataOriginal) => {
        setLeadData(leadDataOriginal);
        setCampaignList(campaignTags);
        setShowCampaignModal(true);
    };

    const checkOverDue = (reminders) => {
        if (!reminders) {
            return false;
        }
        const overDue = reminders.filter((reminder) => {
            const { reminderDate } = reminder;
            return isOverDue(reminderDate);
        });
        return overDue?.length > 0 ? true : false;
    };

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
                Cell: ({ value, row }) => {
                    const leadDataOriginal = row?.original;
                    const remindersList = value?.filter((reminder) => !reminder?.isComplete);
                    const remindersLength = remindersList?.length;
                    const isOverDueReminder = checkOverDue(remindersList) ? true : false;
                    return (
                        <>
                            <CardBadge
                                label=""
                                name="reminder"
                                onClick={() => remindersHandler(remindersLength, leadDataOriginal)}
                                IconComponent={
                                    <Box sx={{ cursor: "pointer" }}>
                                        {remindersLength === 0 ? (
                                            <Box sx={{ top: "10px" }}>
                                                <AddReminder />
                                            </Box>
                                        ) : (
                                            <Reminder color={isOverDueReminder ? "#F44236" : "#4178FF"} />
                                        )}
                                    </Box>
                                }
                                count={remindersLength > 1 ? remindersLength : null}
                            />
                        </>
                    );
                },
            },
            {
                Header: "Campaign",
                disableSortBy: true,
                accessor: "campaign",
                Cell: ({ value, row }) => {
                    const leadDataOriginal = row?.original;
                    const campaignTags = row?.original?.leadTags?.filter((tag) =>
                        tag?.tag?.tagCategory?.tagCategoryName?.includes("Campaign")
                    );
                    const campaignTagDefaultImage = campaignTags?.[0]?.tag?.tagIconUrl;
                    return (
                        <>
                            {campaignTags?.length > 0 ? (
                                <CardBadge
                                    label=""
                                    name={"campaign"}
                                    onClick={() => campaignTagsHandler(campaignTags, leadDataOriginal)}
                                    IconComponent={
                                        campaignTagDefaultImage ? (
                                            <Box className={styles.iconWrapper}>
                                                <img src={campaignTagDefaultImage} />
                                            </Box>
                                        ) : (
                                            <Box className={styles.iconWrapper}>
                                                <CampaignStatus />
                                            </Box>
                                        )
                                    }
                                    count={campaignTags?.length > 1 ? campaignTags?.length : null}
                                />
                            ) : null}
                        </>
                    );
                },
            },
            {
                Header: "Ask Integrity",
                disableSortBy: true,
                accessor: "askIntegrity",
                Cell: ({ value, row }) => {
                    const leadDataOriginal = row?.original;
                    const askIntegrityTags = row?.original?.leadTags?.filter(
                        (tag) =>
                            tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Recommendations" ||
                            tag?.tag?.tagCategory?.tagCategoryName === "Ask Integrity Suggests"
                    );

                    return (
                        <>
                            {askIntegrityTags?.length > 0 ? (
                                <CardBadge
                                    label=""
                                    name="askIntegrity"
                                    onClick={() => askIntegrityHandler(askIntegrityTags, leadDataOriginal)}
                                    IconComponent={
                                        <Box className={styles.iconWrapper}>
                                            <AskIntegrity />
                                        </Box>
                                    }
                                    count={askIntegrityTags?.length > 1 ? askIntegrityTags?.length : null}
                                />
                            ) : null}
                        </>
                    );
                },
            },
            {
                Header: "Life",
                disableSortBy: true,
                accessor: "lifePolicyCount",
                Cell: ({ value, row }) => {
                    if (value === 0 || !value) {
                        return <HeartInactive />;
                    } else {
                        const leadDetails = row?.original;
                        const { firstName, lastName, leadsId } = leadDetails;
                        return (
                            <Box
                                position="relative"
                                display="inline-block"
                                onClick={() => openPolicyModal({ firstName, lastName, leadsId, policy: "LIFE" })}
                            >
                                <CardBadge
                                    IconComponent={<Heartactive />}
                                    count={value}
                                    classes={styles.badgeContainer}
                                />
                            </Box>
                        );
                    }
                },
            },
            {
                Header: "Health",
                disableSortBy: true,
                accessor: "healthPolicyCount",
                Cell: ({ value, row }) => {
                    if (value === 0 || !value) {
                        return <HealthInactive />;
                    } else {
                        const leadDetails = row?.original;
                        const { firstName, lastName, leadsId } = leadDetails;
                        return (
                            <Box
                                position="relative"
                                display="inline-block"
                                onClick={() => openPolicyModal({ firstName, lastName, leadsId, policy: "HEALTH" })}
                            >
                                <CardBadge
                                    IconComponent={<HealthActive />}
                                    count={value}
                                    classes={styles.badgeContainer}
                                />
                            </Box>
                        );
                    }
                },
            },
            {
                Header: "Connect",
                disableSortBy: true,
                accessor: "connect",
                Cell: ({ row }) => {
                    const { primaryCommunication, emails } = row?.original;
                    const isPhoneConnect = primaryCommunication === "phone";
                    return isPhoneConnect ? (
                        <ConnectCall row={row?.original} view="List" />
                    ) : (
                        <ConnectEmail data={row?.original} emails={emails} view="List" />
                    );
                },
            },
            {
                Header: "",
                disableSortBy: true,
                accessor: "actions",
                Cell: ({ row }) => (
                    <CountyDataProvider>
                        <ActionsCell row={row} refreshData={refreshData} />
                    </CountyDataProvider>
                ),
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
            <ReminderModals
                leadData={leadData}
                isMobile={isMobile}
                showAddReminderModal={showAddReminderModal}
                setShowAddReminderModal={setShowAddReminderModal}
                showRemindersListModal={showRemindersListModal}
                setShowRemindersListModal={setShowRemindersListModal}
                view="List"
            />
            <PoliciesProvider>
                <PolicyDetailsModal
                    showPolicyModal={showPolicyModal}
                    policyDetails={policyDetails}
                    handleModalClose={() => setShowPolicyModal(false)}
                />
            </PoliciesProvider>
            {showAskIntegrityModal && (
                <AskIntegrityModal
                    open={showAskIntegrityModal}
                    onClose={() => setShowAskIntegrityModal(false)}
                    leadData={leadData}
                    askIntegrityList={askIntegrityList}
                    view="List"
                />
            )}
            {showCampaignModal && (
                <CampaignModal
                    open={showCampaignModal}
                    onClose={() => setShowCampaignModal(false)}
                    leadData={leadData}
                    campaignList={campaignList}
                    view="List"
                />
            )}
        </>
    );
}

export default ContactsTable;
