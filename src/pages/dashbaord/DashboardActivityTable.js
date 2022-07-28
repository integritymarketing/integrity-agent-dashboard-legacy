import React, { useMemo, useState } from "react";
import "./activitytable.scss";
import Table from "../../packages/TableWrapper";
import { useHistory } from "react-router-dom";

import { dateFormatter } from "utils/dateFormatter";
import { TextButton } from "packages/Button";
import Typography from "@mui/material/Typography";
import { Button } from "packages/Button";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import styles from "./DashboardActivityTable.module.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Heading2 from "packages/Heading2";
import Filter from "components/icons/activities/Filter";
import ActiveFilter from "components/icons/activities/ActiveFilter";

const initialState = {
  sortBy: [
    {
      id: "date",
      desc: false,
    },
  ],
};

const soaSubjectConditions = [
  "Scope of Appointment Signed",
  "Scope of Appointment Completed",
];

function renderSOAButton(row) {
  const { activityTypeName, activityInteractionURL, activitySubject } = row;
  const isActivitySubjectSoa = soaSubjectConditions.some((condition) =>
    activitySubject.includes(condition)
  );
  const buttonText =
    activitySubject === "Scope of Appointment Signed" ? "Complete" : "View";

  return (
    activityTypeName === "Triggered" &&
    activityInteractionURL &&
    isActivitySubjectSoa && <Button size="small">{buttonText}</Button>
  );
}

export default function DashboardActivityTable({
  data = [],
  pageHasMoreRows,
  onShowMore,
  onRowClick,
}) {
  const history = useHistory();
  const [filterToggle, setFilterToggle] = useState(false);

  const columns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) => new Date(row?.original?.createDate),
        Cell: ({ row }) => (
          <Typography
            color="#434A51"
            fontSize="16px"
            onClick={() => onRowClick(row?.original.activities[0])}
          >
            {dateFormatter(row?.original?.createDate, "MM/DD")}
          </Typography>
        ),
      },
      {
        id: "name",
        Header: "Name",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <Typography
              noWrap
              fontWeight="bold"
              fontSize="16px"
              color="#0052CE"
              onClick={() => {
                history.push(`/contact/${row?.original?.leadsId}`);
              }}
            >
              <strong>
                {`${row?.original?.firstName} ${row?.original?.lastName}`}{" "}
              </strong>
            </Typography>
          </div>
        ),
      },
      {
        id: "activity",
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
            <ActivitySubjectWithIcon
              activitySubject={row?.original?.activities[0].activitySubject}
            />
            <Typography
              color="#434A51"
              fontSize={"16px"}
              noWrap
              onClick={() => onRowClick(row?.original.activities[0])}
            >
              {row?.original?.activities[0].activitySubject}
            </Typography>
          </div>
        ),
      },
      {
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (
          <span onClick={() => onRowClick(row?.original.activities[0])}>
            {renderSOAButton(row?.original?.activities[0])}
          </span>
        ),
      },
      {
        id: "more",
        disableSortBy: true,
        Header: () => (
          <span
            className={
              filterToggle
                ? `${styles.filterActive} ${styles.filter}`
                : styles.filter
            }
            onClick={() => setFilterToggle(!filterToggle)}
          >
            {filterToggle ? <ActiveFilter /> : <Filter />}
          </span>
        ),
        Cell: ({ row }) => (
          <span onClick={() => onRowClick(row?.original.activities[0])}>
            <MoreHorizOutlinedIcon />
          </span>
        ),
      },
    ],
    [onRowClick, history, filterToggle]
  );

  return (
    <>
      <Heading2 className={styles.recentActivity} text="Recent Activity" />
      <Table
        initialState={initialState}
        data={data}
        columns={columns}
        footer={
          pageHasMoreRows ? (
            <TextButton onClick={onShowMore}>Show more</TextButton>
          ) : null
        }
      />
    </>
  );
}
