import React from "react";
import Box from "@mui/material/Box";
import { ColorOptionRender } from "utils/shared-utils/sharedUtility";
import { Typography } from "@mui/material";
import styles from "./styles.module.scss";
import CheckMark from "../CheckMarkIcon/CheckMark";

const StageList = ({ row, selectStage, stages }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 2px",
        cursor: "pointer",
        borderBottom: "1px solid lightgrey",
        "&:last-child": {
          borderBottom: "unset",
        },
      }}
      onClick={() => selectStage(row?.statusId)}
      key={row.name}
    >
      <div>
        <Typography
          sx={{ color: "#434A51", fontSize: "16px" }}
          variant={"subtitle1"}
        >
          <ColorOptionRender
            key={row.name}
            {...row}
            filter={true}
            className={styles.stageFilters}
          />
        </Typography>
      </div>

      <CheckMark
        // show={stages === row?.statusId}
        show={
          stages?.findIndex((statusId) => statusId === row?.statusId) > -1
            ? true
            : false
        }
      />
    </Box>
  );
};

export default function Stages({ statusOptions, stages, selectStage }) {
  const length = statusOptions?.length;
  const halfLength = Math.round(length / 2);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        borderRadius: 3,
        marginTop: "18px",
        justifyContent: "space-between",
      }}
    >
      <div className={styles.listContainer}>
        {statusOptions &&
          statusOptions.map((row, i) => {
            if (i >= 0 && i < halfLength) {
              return (
                <StageList
                  key={`firstStaegs-${i}`}
                  row={row}
                  selectStage={selectStage}
                  stages={stages}
                />
              );
            } else return null;
          })}
      </div>
      <div className={styles.listContainer}>
        {statusOptions &&
          statusOptions.map((row, i) => {
            if (i >= halfLength && i < length) {
              return (
                <StageList
                  key={`secondStages-${i}`}
                  row={row}
                  selectStage={selectStage}
                  stages={stages}
                />
              );
            } else return null;
          })}
      </div>
    </Box>
  );
}
