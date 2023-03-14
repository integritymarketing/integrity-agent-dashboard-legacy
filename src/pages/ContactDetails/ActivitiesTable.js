import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Table from "packages/TableWrapper";
import { convertUTCDateToLocalDate } from "utils/dates";
import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import ActivityButtonIcon from "pages/ContactDetails/ActivityButtonIcon";
import styles from "./Activities.module.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

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

const buttonTextByActivity = {
  "Incoming Call": "Link to Contact",
  "Call Recording": "Download",
  "Contact's new call log created": "Download",
  "Outbound Call Recorded": "Download",
  "Incoming Call Recorded": "Download",
  "Scope of Appointment Signed": "Complete",
  "Scope of Appointment Completed": "View",
  "Plan Shared": "View Plans",
};

const renderButtons = (activity, handleClick) => {
  if (!activity) return false;
  const {
    activityTypeName = "",
    activityInteractionURL = "",
    activitySubject = "",
  } = activity;

  if (
    activityTypeName &&
    (activityTypeName === "Triggered" ||
      activitySubject === "Meeting Recorded") &&
    activityInteractionURL
  ) {
    return (
      <div
        className={styles.activityDataCell}
        onClick={(e) => handleClick(activitySubject, activityInteractionURL)}
      >
        <ActivityButtonIcon
          activitySubject={activitySubject}
          route="contactDetail"
        />
        <Typography color="#434A51" fontSize={"16px"} noWrap>
          {buttonTextByActivity[activitySubject]}
        </Typography>
      </div>
    );
  }
  return false;
};

const isCustomActivity = (row) =>
  row.activityId && row.activityTypeName === "Note";

const renderActivtyActions = (row, handleDeleteActivity, setEditActivity) => {
  if (isCustomActivity(row)) {
    const handleEditClick = () => {
      setEditActivity(row);
    };
    return (
      <>
        <button
          className={styles.deleteTextAreaText}
          onClick={() => handleDeleteActivity(row)}
        >
          Delete
        </button>
        <button className={styles.ediTextAreaText} onClick={handleEditClick}>
          Edit
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
}) {
  const history = useHistory();
  const [sort, setSort] = useState("date:asc");
  const [fullList, setFullList] = useState([]);

  useEffect(() => {
    setFullList([...data]);
  }, [data]);

  const handleClick = useCallback(
    (activitySubject, activityInteractionURL) => {
      const splitViewPlansURL = activityInteractionURL.split("/");

      switch (activitySubject) {
        case "Scope of Appointment Signed":
        case "Scope of Appointment Completed":
          history.push(
            `/contact/${leadId}/soa-confirm/${activityInteractionURL}`
          );
          break;
        case "Plan Shared":
          history.push(
            `/plans/${leadId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`
          );
          break;
        case "Call Recording":
        case "Incoming Call Recorded":
        case "Outbound Call Recorded":
        case "Contact's new call log created":
        case "Meeting Recorded":
          window.open(activityInteractionURL, "_blank");
          break;
        default:
          break;
      }
    },
    [history, leadId]
  );

  const webColumns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) =>
          row?.original?.modifyDate
            ? row?.original?.modifyDate
            : row?.original?.createDate,
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(
            row?.original?.modifyDate
              ? row?.original?.modifyDate
              : row?.original?.createDate
          );
          return (
            <span onClick={() => onActivityClick(row?.original)}>
              {dateFormatter(date, "MM/DD/yyyy")}
            </span>
          );
        },
      },
      {
        id: "activity",
        accessor: (row) => row?.original?.activitySubject,
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activitySubject}
            />
            <Typography noWrap onClick={() => onActivityClick(row?.original)}>
              <strong>{row?.original?.activitySubject} </strong>
              <span>{row?.original?.activityBody}</span>
            </Typography>
          </div>
        ),
      },
      {
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => <>{renderButtons(row?.original, handleClick)}</>,
      },
      {
        id: "actions",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <>
            {renderActivtyActions(
              row?.original,
              handleDeleteActivity,
              setEditActivity
            )}
          </>
        ),
      },
      {
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onActivityClick(row?.original)}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onActivityClick, handleClick, setEditActivity, handleDeleteActivity]
  );

  const mobileColumns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) =>
          row?.original?.modifyDate
            ? row?.original?.modifyDate
            : row?.original?.createDate,
        Cell: ({ row }) => {
          let date = convertUTCDateToLocalDate(
            row?.original?.modifyDate
              ? row?.original?.modifyDate
              : row?.original?.createDate
          );
          return (
            <span onClick={() => onActivityClick(row?.original)}>
              {dateFormatter(date, "MM/DD/YY")}
            </span>
          );
        },
      },
      {
        id: "activity",
        accessor: (row) => row?.original?.activitySubject,
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activitySubject}
            />
            <Typography noWrap onClick={() => onActivityClick(row?.original)}>
              <strong>
                {row?.original?.activitySubject?.length > 15
                  ? `${row?.original?.activitySubject?.slice(0, 13)}...`
                  : row?.original?.activitySubject}
              </strong>
            </Typography>
          </div>
        ),
      },
      {
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onActivityClick(row?.original)}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onActivityClick]
  );

  let columns = isMobile ? mobileColumns : webColumns;

  const handleSortUpdate = (value) => {
    switch (value) {
      case "Date":
        if (sort === "date:asc") {
          setSort("date:desc");
          let sorted = fullList.sort(
            (a, b) => new Date(a.createDate) - new Date(b.createDate)
          );
          setFullList([...sorted]);
        } else {
          setSort("date:asc");
          let sorted = fullList.sort(
            (a, b) => new Date(b.createDate) - new Date(a.createDate)
          );
          setFullList([...sorted]);
        }
        break;
      case "Activity":
        if (sort === "activity:asc") {
          setSort("activity:desc");
          let sorted = fullList.sort((a, b) =>
            a.activitySubject.localeCompare(b.activitySubject)
          );
          setFullList([...sorted]);
        } else {
          setSort("activity:asc");
          let sorted = fullList.sort((a, b) =>
            b.activitySubject.localeCompare(a.activitySubject)
          );
          setFullList([...sorted]);
        }
        break;
      default:
        setSort("date:asc");
    }
  };

  return (
    <Table
      handleSort={handleSortUpdate}
      initialState={initialState}
      data={fullList}
      columns={columns}
      footer={
        pageHasMoreRows ? (
          <TextButton onClick={onShowMore}>Show more</TextButton>
        ) : null
      }
    />
  );
}
