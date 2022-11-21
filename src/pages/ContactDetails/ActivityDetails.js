import React, { useState } from "react";
import styles from "./ActivityDetails.module.scss";
import { Box, TextField } from "@mui/material";
import Dialog from "packages/Dialog";
import ActivityButtonText from "pages/ContactDetails/ActivityButtonText.js";
import CreatedDate from "./CreatedDate";
import { formatPhoneNumber } from "utils/phones";

export default function ActivityDetails({
  open,
  onSave,
  onClose,
  activityObj,
  leadFullName,
}) {
  const [note, setNote] = useState(activityObj?.activityNote);

  let type = activityObj?.activityTypeName;

  const callRecordFormat = (item) => {
    if (!item) return null;
    let itemParse = item?.split(":");
    let itemFormat =
      itemParse?.length > 0 ? formatPhoneNumber(itemParse[1], true) : "-";
    return itemFormat;
  };

  const activityBody_Parser = (data) => {
    if (!data) return null;
    let dataParse = data?.split(",");
    return (
      <div className={styles.parsedBody}>
        {dataParse &&
          dataParse.map((item, index) => {
            return (
              <div className={index > 0 ? "mt-2" : ""} key={index}>
                {item.includes("Call recorded to")
                  ? `Call recorded to :  ${callRecordFormat(item)}`
                  : item}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <Box>
      <Dialog
        fullWidth={true}
        keepMounted
        open={open}
        onSave={() => {
          onSave(activityObj, note);
        }}
        title={activityObj?.activitySubject}
        saveText={"Save"}
        onCancel={onClose}
        onClose={onClose}
        maxWidth="sm"
        disabled={
          activityObj?.activityNote === note || !note || note?.length < 2
        }
      >
        <div className={styles.subSection}>
          <div>
            <div className={styles.subHeading}>
              <div className={styles.subHeadingTitle}>{leadFullName}</div>
            </div>
            {activityObj && type === "Triggered" && (
              <>
                <div className={styles.topSection}>
                  {activityBody_Parser(activityObj?.activityBody)}
                  <ActivityButtonText activity={activityObj} />
                </div>
                <CreatedDate
                  value={
                    type === "Note" && activityObj?.modifyDate
                      ? activityObj?.modifyDate
                      : activityObj?.createDate
                  }
                />
              </>
            )}
          </div>
          <div>
            {type === "Triggered" && (
              <div className={styles.subHeading}>
                <div className={styles.subHeadingTitle}>Activity Note</div>
              </div>
            )}
            <div>
              <TextField
                sx={{
                  background: "white",
                  border: "1px solid #DFDEDD",
                  borderRadius: "8px",
                  placeholder: {
                    color: "red",
                  },
                }}
                hiddenLabel
                multiline
                fullWidth
                rows={2}
                value={note || ""}
                placeholder="Add a note about this activity"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            {type === "Note" && (
              <CreatedDate
                value={
                  activityObj?.modifyDate
                    ? activityObj?.modifyDate
                    : activityObj?.createDate
                }
              />
            )}
          </div>
        </div>
      </Dialog>
    </Box>
  );
}
