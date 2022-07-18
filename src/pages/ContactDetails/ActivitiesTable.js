import React, {useMemo} from "react";
import Table from "../../packages/TableWrapper";
import { dateFormatter } from "utils/dateFormatter";
import {TextButton} from "packages/Button";
import Typography from '@mui/material/Typography';
import { Button } from "packages/Button";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import styles from './Activities.module.scss';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const initialState = {
  sortBy:[ {
    id: 'date',
    desc: false,
  }]
}
const soaSubjectConditions = ["Scope of Appointment Signed", "Scope of Appointment Completed"];

function renderSOAButton(row) {
  const { activityTypeName, activityInteractionURL, activitySubject } =
    row.original;
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

function ActivitiesTable({ data = [], onShowMore, pageHasMoreRows, onActivityClick }) {
  const columns = useMemo(
    () => [
      {
        id: "date",
        Header: "Date",
        accessor: (row) => new Date(row?.original?.createDate),
        Cell: ({ row }) => <span onClick={()=>onActivityClick(row?.original)}>{dateFormatter(row?.original?.createDate, 'MM/DD')}</span>,
        
      },
      {
        id: "activity",
        disableSortBy: true,
        Header: "Activity",
        Cell: ({ row }) => (
          <div className={styles.activityDataCell}>
          <ActivitySubjectWithIcon activitySubject={row?.original?.activitySubject} />
          <Typography noWrap onClick={()=>onActivityClick(row?.original)}>
            <strong>{row?.original?.activitySubject} </strong>
            <span>{row?.original?.activityBody}</span>
          </Typography>
          </div>
        )
      },
      {
        id: "status",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => (<span onClick={()=>onActivityClick(row?.original)}>{renderSOAButton(row)}</span>)
      },
      {
        id: "more",
        disableSortBy: true,
        Header: "",
        Cell: ({ row }) => <span onClick={()=>onActivityClick(row?.original)}><MoreHorizOutlinedIcon/></span>
      }
    ],
    [onActivityClick]
  );

  return (
    <Table 
      initialState={initialState}
      data={data} 
      columns={columns}
      footer={pageHasMoreRows ? <TextButton onClick={onShowMore}>Show more</TextButton> : null } />
  );
}

export default ActivitiesTable;
