import * as Sentry from "@sentry/react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Media from "react-media";
import { useNavigate } from "react-router-dom";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Typography from "@mui/material/Typography";

import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import { dateFormatter } from "utils/dateFormatter";
import { convertUTCDateToLocalDate } from "utils/dates";
import { MORE_ACTIONS, PLAN_ACTION } from "utils/moreActions";

import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import Table from "../../packages/TableWrapper";
import { TextButton } from "packages/Button";
import ContactSectionCard from "packages/ContactSectionCard";
import Filter from "packages/Filter/Filter";
import FilterOptions from "packages/Filter/FilterOptions";

import { ConnectModal } from "components/ContactDetailsContainer/ConnectModal";
import { AddReminderModal } from "components/ContactDetailsContainer/ContactDetailsModals/AddReminderModal/AddReminderModal";
import ActiveFilter from "components/icons/activities/ActiveFilter";
import FilterIcon from "components/icons/activities/Filter";
import ActionsDropdown from "components/ui/ActionsDropdown";

import ContactContext from "contexts/contacts";
import { ActionsCell } from "../ContactsList/ContactsTable/ActionsCell";
import { useClientServiceContext } from "services/clientServiceProvider";

import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";
import ActivityDetails from "pages/ContactDetails/ActivityDetails";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import SOAModal from "pages/contacts/contactRecordInfo/soaList/SOAModal";

import CallDetails from "./CallDetails";
import styles from "./DashboardActivityTable.module.scss";
import "./activitytable.scss";

const getActivitySubject = (activitySubject) => {
    switch (activitySubject) {
        case "Scope of Appointment Sent":
        case "Scope of Appointment Signed":
        case "Scope of Appointment Completed":
            const text = activitySubject.replace("Scope of Appointment", "SOA");
            return text;
        case "Stage Change":
            return "Stage Changed";
        case "Contact's new call log created":
            return "Call Recording";
        default:
            return activitySubject;
    }
};
const buttonTextByActivity = {
    "Incoming Call": "Link to Contact",
    "Call Recording": "Download",
    "Contact's new call log created": "Download",
    "Outbound Call Recorded": "Download",
    "Incoming Call Recorded": "Download",
    "Scope of Appointment Signed": "View",
    "Scope of Appointment Completed": "View",
    "Plan Shared": "View Plans",
    "Application Submitted": "View",
    "Meeting Recorded": "Download",
};

const FILTER_OPTIONS = [
    { name: "Application Submitted", selected: false },
    { name: "Call Recording", selected: false },
    { name: "Contact Created", selected: false },
    { name: "Contact Updated", selected: false },
    { name: "Contact Imported", selected: false },
    { name: "Reminder Added", selected: false },
    { name: "Reminder Complete", selected: false },
    { name: "Contact's new call log created", selected: false },
    { name: "Incoming Call", selected: false },
    { name: "Incoming Call Recorded", selected: false },
    { name: "Meeting Recorded", selected: false },
    { name: "Outbound Call Recorded", selected: false },
    { name: "Plan Shared", selected: false },
    { name: "Scope of Appointment Sent", selected: false },
    { name: "Scope of Appointment Completed", selected: false },
    { name: "Scope of Appointment Signed", selected: false },
    { name: "Shopper Priority 1 - Major Coverage Changes", selected: false },
    { name: "Shopper Priority 2 - Network or Prescription Changes", selected: false },
    { name: "Shopper Priority 3 - Plan Review Necessary", selected: false },
    { name: "Shopper Priority 4 - Plan Review Suggested", selected: false },
    { name: "Shopper Priority 5 - Plan Review Optional", selected: false },
    { name: "Stage Change", selected: false },
    { name: "Legacy Safeguard Eligible", selected: false },
];
const renderButtons = (activity, leadsId, handleClick) => {
    if (!activity) {
        return false;
    }
    const { activityTypeName = "", activityInteractionURL = "", activitySubject = "" } = activity;

    if (
        activityTypeName &&
        (activityTypeName === "Triggered" || activitySubject === "Meeting Recorded") &&
        activityInteractionURL
    ) {
        return (
            <div
                className={styles.activityDataCell}
                onClick={() => handleClick(activitySubject, activityInteractionURL, leadsId)}
            >
                <ActivityButtonIcon activitySubject={activitySubject} />
                <Typography color="#434A51" fontSize={"16px"} noWrap>
                    {buttonTextByActivity[activitySubject]}
                </Typography>
            </div>
        );
    }
    return false;
};

export default function DashboardActivityTable({
    activityData,
    realoadActivityData,
    setPage,
    page,
    showMore,
    setSelectedFilterValues,
    selectedFilterValues,
    setSort,
    sort,
}) {
    const navigate = useNavigate();
    const showToast = useToast();
    const { setNewSoaContactDetails } = useContext(ContactContext);
    const [filterToggle, setFilterToggle] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(null);
    const [showAddNewModal, setShowAddNewModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedCall, setSelectedCall] = useState(null);
    const [selectedLead, setSelectedLead] = useState();
    const [isMobile, setIsMobile] = useState(false);
    const [filterValues, setFilterValues] = useState(FILTER_OPTIONS);
    const userProfile = useUserProfile();
    const [leadId, setLeadId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [leadConnectModal, setLeadConnectModal] = useState(false);
    const [leadDetails, setLeadDetails] = useState(null);

    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();
    const { clientsService, comparePlansService } = useClientServiceContext();

    const { npn } = userProfile;
    useEffect(() => {
        setFilteredData([...activityData]);
    }, [activityData]);

    const navigateToPage = (leadId, page) => {
        navigate(`/${page}/${leadId}`);
    };

    const handleDropdownActions = (contact) => (value, leadId) => {
        setLeadId(leadId);
        setLeadDetails(contact);
        switch (value) {
            case "addnewreminder":
                setShowAddModal(leadId);
                setShowAddNewModal(true);
                break;
            case "new-soa":
                setNewSoaContactDetails(contact);
                setOpenModal(true);
                break;
            case "plans":
            case "contact":
                navigateToPage(leadId, value);
                break;
            case "connect":
                setLeadConnectModal(true);
                break;
            default:
                break;
        }
    };

    const handleClick = useCallback(
        async (activitySubject, activityInteractionURL, leadsId) => {
            const splitViewPlansURL = activityInteractionURL.split("/");
            switch (activitySubject) {
                case "Scope of Appointment Signed":
                    setLinkCode(activityInteractionURL);
                    setSelectedTab("scope-of-appointment");
                    navigate(`/contact/${leadsId}/scope-of-appointment`);

                    break;
                case "Scope of Appointment Completed":
                    setLinkCode(activityInteractionURL);
                    setSelectedTab("view-scope-of-appointment");
                    navigate(`/contact/${leadsId}/view-scope-of-appointment`);
                    break;
                case "Plan Shared":
                    navigate(`/plans/${leadsId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`);
                    break;
                case "Call Recording":
                case "Incoming Call Recorded":
                case "Outbound Call Recorded":
                case "Contact's new call log created":
                case "Meeting Recorded":
                    window.open(activityInteractionURL, "_blank");
                    break;
                case "Application Submitted":
                    const link = await comparePlansService?.getPdfSource(activityInteractionURL, npn);
                    var url = await window.URL.createObjectURL(link);

                    if (url && url !== "") {
                        window.open(url, "_blank");
                    }
                    break;
                default:
                    break;
            }
        },
        [navigate, npn]
    );

    const saveReminder = (payload) => {
        const addPayload = {
            ...payload,
            leadsId: showAddModal,
        };
        clientsService
            .createReminder(addPayload)
            .then(() => {
                showToast({
                    type: "success",
                    message: "Reminder successfully added.",
                    time: 3000,
                });
                realoadActivityData();
            })
            .catch(() => {
                showToast({
                    type: "error",
                    message: `Failed to Add reminders`,
                });
            });
        setShowAddNewModal(false);
    };

    const handleTableRowClick = useCallback(
        (row) => {
            setSelectedLead({
                fullName: `${row?.firstName} ${row?.lastName}`,
                ...row,
            });
            setSelectedActivity(row.activities[0]);
        },
        [setSelectedActivity, setSelectedLead]
    );

    const columns = useMemo(
        () => [
            {
                id: "date",
                Header: "Date",
                accessor: (row) => row?.original?.activities[0]?.createDate,
                Cell: ({ row }) => {
                    const date = convertUTCDateToLocalDate(row?.original?.activities[0]?.createDate);
                    return (
                        <Typography color="#434A51" fontSize="16px">
                            {dateFormatter(date, "MM/DD/yyyy")}
                        </Typography>
                    );
                },
            },
            {
                id: "name",
                Header: "Name",
                accessor: (row) => `${row?.original?.firstName} ${row?.original?.lastName}`,
                Cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <Typography
                            noWrap
                            fontWeight="bold"
                            fontSize="16px"
                            color="#0052CE"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/contact/${row?.original?.leadsId}`);
                            }}
                        >
                            <strong>{`${row?.original?.firstName} ${row?.original?.lastName}`} </strong>
                        </Typography>
                    </div>
                ),
            },
            {
                id: "activity",
                Header: "Activity",
                accessor: (row) => `${row?.original?.activities[0]?.activitySubject}`,
                Cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <ActivitySubjectWithIcon
                            activitySubject={row?.original?.activities[0]?.activitySubject}
                            interactionIconUrl={row?.original?.activities[0]?.activityInteractionIconUrl}
                            activityId={row?.original?.activities[0]?.activityId}
                            iconURL={row?.original?.activities[0]?.activityIconUrl}
                        />
                        <Typography
                            color="#434A51"
                            fontSize={"16px"}
                            noWrap
                            onClick={() => {
                                handleTableRowClick(row?.original);
                            }}
                        >
                            {getActivitySubject(row?.original?.activities[0]?.activitySubject)}
                        </Typography>
                    </div>
                ),
            },
            {
                id: "inboundcall",
                disableSortBy: true,
                Header: "",
                Cell: () => null,
            },
            {
                id: "status",
                disableSortBy: true,
                Header: "",
                Cell: ({ row }) => (
                    <>{renderButtons(row?.original?.activities[0], row?.original?.leadsId, handleClick)}</>
                ),
            },
            {
                Header: "",
                id: "more",
                disableSortBy: true,
                accessor: "reminders",
                Cell: ({ value, row }) => {
                    const options = MORE_ACTIONS.slice(0);

                    if (
                        row?.original?.addresses?.[0]?.postalCode &&
                        row?.original?.addresses?.[0]?.county &&
                        row?.original?.addresses?.[0]?.stateCode
                    ) {
                        options.splice(1, 0, PLAN_ACTION);
                    }
                    return (
                        <>
                            {/* <ActionsDropdown
                                options={options}
                                id={row.original.leadsId}
                                onClick={handleDropdownActions(row.original)}
                            >
                                <MoreHorizOutlinedIcon />
                            </ActionsDropdown> */}

                            <ActionsCell row={row} refreshData={realoadActivityData} />
                            {showAddNewModal && (
                                <AddReminderModal
                                    open={showAddNewModal}
                                    onClose={() => setShowAddNewModal(false)}
                                    onSave={saveReminder}
                                    selectedReminder={null}
                                />
                            )}
                        </>
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigate, showAddModal, showAddNewModal, setShowAddNewModal]
    );

    const mobileColumns = useMemo(
        () => [
            {
                id: "name",
                Header: "Name",
                accessor: (row) => `${row?.original?.firstName} ${row?.original?.lastName}`,
                Cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <Typography
                            noWrap
                            fontWeight="bold"
                            fontSize="16px"
                            color="#0052CE"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/contact/${row?.original?.leadsId}`);
                            }}
                        >
                            <strong>{`${row?.original?.firstName} ${row?.original?.lastName}`} </strong>
                        </Typography>
                    </div>
                ),
            },
            {
                id: "activity",
                Header: "Activity",
                accessor: (row) => `${row?.original?.activities[0]?.activitySubject}`,
                Cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <ActivitySubjectWithIcon
                            activitySubject={row?.original?.activities[0]?.activitySubject}
                            interactionIconUrl={row?.original?.activities[0]?.activityInteractionIconUrl}
                            activityId={row?.original?.activities[0]?.activityId}
                            iconURL={row?.original?.activities[0]?.activityIconUrl}
                        />
                        <Typography
                            color="#434A51"
                            fontSize={"16px"}
                            noWrap
                            onClick={() => {
                                handleTableRowClick(row?.original);
                            }}
                        >
                            {getActivitySubject(row?.original?.activities[0]?.activitySubject)}
                        </Typography>
                    </div>
                ),
            },
            {
                id: "date",
                Header: "Date",
                accessor: (row) => row?.original?.activities[0]?.createDate,
                Cell: ({ row }) => {
                    const date = convertUTCDateToLocalDate(row?.original?.activities[0]?.createDate);
                    return (
                        <Typography color="#434A51" fontSize="16px">
                            {dateFormatter(date, "MM/DD/yyyy")}
                        </Typography>
                    );
                },
            },
            {
                id: "inboundcall",
                disableSortBy: true,
                Header: "",
                Cell: () => null,
            },
            {
                id: "status",
                disableSortBy: true,
                Header: "",
                Cell: ({ row }) => (
                    <>{renderButtons(row?.original?.activities[0], row?.original?.leadsId, handleClick)}</>
                ),
            },
            {
                Header: "",
                id: "more",
                disableSortBy: true,
                accessor: "reminders",
                Cell: ({ value, row }) => {
                    const options = MORE_ACTIONS.slice(0);

                    if (
                        row?.original?.addresses?.[0]?.postalCode &&
                        row?.original?.addresses?.[0]?.county &&
                        row?.original?.addresses?.[0]?.stateCode
                    ) {
                        options.splice(1, 0, PLAN_ACTION);
                    }
                    return (
                        <>
                            <ActionsDropdown
                                options={options}
                                id={row.original.leadsId}
                                onClick={handleDropdownActions(row.original)}
                            >
                                <MoreHorizOutlinedIcon />
                            </ActionsDropdown>

                            {showAddNewModal && (
                                <AddReminderModal
                                    open={showAddNewModal}
                                    onClose={() => setShowAddNewModal(false)}
                                    onSave={saveReminder}
                                    selectedReminder={null}
                                />
                            )}
                        </>
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigate, showAddModal, showAddNewModal, setShowAddNewModal]
    );

    const onFilterApply = (selectedValues) => {
        setFilterValues([...selectedValues]);
        const data = selectedValues.filter((item) => item.selected).map((item) => item.name);
        setSelectedFilterValues([...data]);
        setPage(1);
        setFilterToggle(false);
    };

    const onResetFilter = () => {
        setFilterValues((values) => {
            return values.map((v) => ({ ...v, selected: false }));
        });
        setSelectedFilterValues([]);
        setPage(1);
    };

    const handleAddActivtyNotes = useCallback(
        async (activity, activityNote) => {
            const leadsId = selectedLead.leadsId;
            const payload = {
                ...activity,
                activityNote,
            };
            try {
                await clientsService.updateActivity(payload, leadsId);
                realoadActivityData && (await realoadActivityData());
                setSelectedActivity(null);
                showToast({
                    type: "success",
                    message: "Activity notes added successfully",
                    time: 3000,
                });
            } catch (e) {
                Sentry.captureException(e);
            }
        },
        [setSelectedActivity, showToast, selectedLead, realoadActivityData]
    );

    const handleSortUpdate = (value) => {
        switch (value) {
            case "Date":
                if (sort === "Activities.CreateDate:asc") {
                    setSort("Activities.CreateDate:desc");
                } else {
                    setSort("Activities.CreateDate:asc");
                }
                break;
            case "Name":
                if (sort === "firstName:asc") {
                    setSort("firstName:desc");
                } else {
                    setSort("firstName:asc");
                }
                break;
            case "Activity":
                if (sort === "Activities.ActivitySubject:asc") {
                    setSort("Activities.ActivitySubject:desc");
                } else {
                    setSort("Activities.ActivitySubject:asc");
                }
                break;
            default:
                setSort("Activities.CreateDate:desc");
        }
    };

    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <SOAModal id={leadId} openSOAModal={openModal} setOpenSOAModal={setOpenModal} />
            {leadConnectModal && (
                <ConnectModal
                    isOpen={leadConnectModal}
                    onClose={() => setLeadConnectModal(false)}
                    leadId={leadId}
                    leadDetails={leadDetails}
                />
            )}
            <ContactSectionCard
                title="Recent Activity"
                className={styles.enrollmentPlanContainer}
                isDashboard={true}
                customStyle={styles.segregator}
                contentClassName={styles.content}
                actions={
                    <Filter
                        Icon={FilterIcon}
                        ActiveIcon={ActiveFilter}
                        heading={"Filter by Activity Type"}
                        open={filterToggle}
                        onToggle={setFilterToggle}
                        filtered={selectedFilterValues?.length > 0 ? true : false}
                        content={
                            <FilterOptions
                                values={[...filterValues]}
                                multiSelect={true}
                                onApply={onFilterApply}
                                onReset={onResetFilter}
                                showOnlyFilterIcon={true}
                            />
                        }
                    />
                }
                preferencesKey={"RecentActivity_collapse"}
                hideActionIfCollapse={true}
            >
                <Table
                    handleSort={handleSortUpdate}
                    initialState={{}}
                    data={filteredData}
                    columns={isMobile ? mobileColumns : columns}
                    footer={showMore ? <TextButton onClick={() => setPage(page + 1)}>Show more</TextButton> : ""}
                />
            </ContactSectionCard>
            {selectedActivity && (
                <ActivityDetails
                    open={true}
                    onSave={handleAddActivtyNotes}
                    onClose={() => setSelectedActivity(null)}
                    leadFullName={selectedLead?.fullName}
                    activityObj={selectedActivity}
                    leadId={selectedLead?.leadsId}
                    pageName="Dashboard"
                />
            )}
            {selectedCall && <CallDetails open={true} onClose={() => setSelectedCall(null)} callObj={selectedCall} />}
        </>
    );
}
