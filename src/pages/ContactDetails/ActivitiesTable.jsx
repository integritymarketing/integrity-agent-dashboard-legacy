import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useLeadDetails } from "providers/ContactDetails";
import { useScopeOfAppointment } from "providers/ContactDetails/ContactDetailsContext";

import { dateFormatter } from "utils/dateFormatter";
import { convertUTCDateToLocalDate } from "utils/dates";

import useUserProfile from "hooks/useUserProfile";

import { TextButton } from "packages/Button";
import Table from "packages/TableWrapper";

import EditIcon from "components/icons/icon-edit";
import { Button } from "components/ui/Button";

import { useClientServiceContext } from "services/clientServiceProvider";

import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";

import styles from "./Activities.module.scss";

const initialState = {
    sortBy: [
        {
            id: "date",
            desc: false,
        },
        {
            id: "activity",
            desc: false,
        },
    ],
};

const isCustomActivity = (row) => row.activityId && row.activityTypeName === "Note";

const renderActivtyActions = (row, handleDeleteActivity, leadId) => {
    if (isCustomActivity(row)) {
        return (
            <>
                <button
                    className={styles.deleteTextAreaText}
                    onClick={() => handleDeleteActivity(row?.activityId, leadId)}
                >
                    Delete
                </button>
            </>
        );
    }
};
export default function ActivitiesTable({
    data = [],
    onShowMore,
    pageHasMoreRows,
    onActivityClick,
    leadId,
    handleDeleteActivity,
    setEditActivity,
    isMobile,
    setSortingOptions,
}) {
    const navigate = useNavigate();
    const [fullList, setFullList] = useState([]);

    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();

    const userProfile = useUserProfile();
    const { npn } = userProfile;
    const { comparePlansService } = useClientServiceContext();

    useEffect(() => {
        setFullList([...data]);
    }, [data]);

    const handleClick = useCallback(
        async (activitySubject, activityInteractionURL) => {
            const splitViewPlansURL = activityInteractionURL.split("/");

            switch (activitySubject) {
                case "Scope of Appointment Signed":
                    setLinkCode(activityInteractionURL);
                    setSelectedTab("scope-of-appointment");
                    navigate(`/contact/${leadId}/scope-of-appointment`);
                    break;

                case "Scope of Appointment Completed":
                    setLinkCode(activityInteractionURL);
                    setSelectedTab("view-scope-of-appointment");
                    navigate(`/contact/${leadId}/view-scope-of-appointment`);
                    break;
                case "Plan Shared":
                    navigate(`/plans/${leadId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`);
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
        [setLinkCode, setSelectedTab, navigate, leadId, comparePlansService, npn]
    );

    const webColumns = useMemo(
        () => [
            {
                id: "date",
                header: "Date",
                enableSorting: true,
                cell: ({ row }) => {
                    const date = convertUTCDateToLocalDate(row.original.createDate);
                    return (
                        <div className={styles.activityDate} onClick={() => onActivityClick(row.original)}>
                            {dateFormatter(date, "MM/DD/yyyy")}
                        </div>
                    );
                },
            },
            {
                id: "activity",
                header: "Activity",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <ActivitySubjectWithIcon
                            activitySubject={row.original.activitySubject}
                            iconURL={row.original.activityIconUrl}
                            activityId={row.original.activityId}
                            interactionIconUrl={row.original.activityInteractionIconUrl}
                        />
                        <div noWrap onClick={() => onActivityClick(row.original)}>
                            <div className={styles.activitySubject}>
                                {row.original.activitySubject}
                                <span className={styles.activityBody}>
                                    {row.original.activityBody?.length > 15
                                        ? `${row.original.activityBody.slice(0, 13)}...`
                                        : row.original.activityBody}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "actions",
                header: "",
                enableSorting: false,
                cell: ({ row }) => <>{renderActivtyActions(row.original, handleDeleteActivity, leadId)}</>,
            },
            {
                id: "more",
                header: "",
                enableSorting: false,
                cell: ({ row }) => (
                    <Button
                        icon={<EditIcon />}
                        iconPosition="right"
                        label="Edit"
                        onClick={() => onActivityClick(row.original)}
                        type="tertiary"
                        className={styles.buttonWithIcon}
                    />
                ),
            },
        ],
        [onActivityClick, handleDeleteActivity, leadId]
    );

    const mobileColumns = useMemo(
        () => [
            {
                id: "date",
                header: "Date",
                enableSorting: true,
                cell: ({ row }) => {
                    const date = convertUTCDateToLocalDate(row.original.createDate);
                    return (
                        <div className={styles.activityDate} onClick={() => onActivityClick(row.original)}>
                            {dateFormatter(date, "MM/DD/YY")}
                        </div>
                    );
                },
            },
            {
                id: "activity",
                header: "",
                enableSorting: false,
                cell: ({ row }) => (
                    <div className={styles.activityDataCell}>
                        <ActivitySubjectWithIcon
                            activitySubject={row.original.activitySubject}
                            iconURL={row.original.activityIconUrl}
                            activityId={row.original.activityId}
                            interactionIconUrl={row.original.activityInteractionIconUrl}
                        />
                        <div noWrap onClick={() => onActivityClick(row.original)}>
                            <div className={styles.activitySubject}>
                                {row.original.activitySubject}
                                <span className={styles.activityBody}>
                                    {row.original.activityBody?.length > 15
                                        ? `${row.original.activityBody.slice(0, 13)}...`
                                        : row.original.activityBody}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                id: "more",
                header: "",
                enableSorting: false,
                cell: ({ row }) => (
                    <span onClick={() => onActivityClick(row.original)}>
                        <ArrowForwardIosIcon color="primary" />
                    </span>
                ),
            },
        ],
        [onActivityClick]
    );

    const columns = isMobile ? mobileColumns : webColumns;

    const handleSortUpdate = (value) => {
        switch (value) {
            case "Date":
                setSortingOptions((sort) => {
                    return {
                        sortBy: "createDate",
                        order: sort.order === "desc" ? "asc" : "desc",
                    };
                });
                break;
            case "Activity":
                setSortingOptions((sort) => {
                    return {
                        sortBy: "activitySubject",
                        order: sort.order === "desc" ? "asc" : "desc",
                    };
                });
                break;
            default:
                setSortingOptions((sort) => {
                    return {
                        sortBy: "createDate",
                        order: "desc",
                    };
                });
        }
    };

    return (
        <Table
            handleSort={handleSortUpdate}
            initialState={initialState}
            data={fullList}
            columns={columns}
            footer={pageHasMoreRows ? <TextButton onClick={onShowMore}>Show more</TextButton> : null}
        />
    );
}