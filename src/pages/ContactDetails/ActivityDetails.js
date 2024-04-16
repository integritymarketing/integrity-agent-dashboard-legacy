/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from "react";
import styles from "./ActivityDetails.module.scss";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ArrowForwardWithCircle } from "components/ContactDetailsContainer/OverviewContainer/Icons";
import Modal from "components/Modal";
import useAnalytics from "hooks/useAnalytics";
import ActivityButtonText from "pages/ContactDetails/ActivityButtonText.js";
import CreatedDate from "./CreatedDate";
import { formatPhoneNumber } from "utils/phones";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";

export default function ActivityDetails({
    open,
    onSave,
    onClose,
    activityObj,
    leadFullName,
    leadId,
    setDisplay,
    pageName,
}) {
    const { fireEvent } = useAnalytics();
    const [note, setNote] = useState(activityObj?.activityNote);

    useEffect(() => {
        fireEvent("Activity Stream Tag Viewed", {
            leadid: leadId,
            tagName: activityObj?.activitySubject,
            page_name: pageName,
        });
    }, []);

    const type = activityObj?.activityTypeName;

    const callRecordFormat = (item) => {
        if (!item) {
            return null;
        }
        const itemParse = item?.split(":");
        const itemFormat = itemParse?.length > 0 ? formatPhoneNumber(itemParse[1], true) : "-";
        return itemFormat;
    };

    const activityBody_Parser = (data) => {
        if (!data) {
            return null;
        }
        const dataParse = data?.split(",");
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
            <Modal
                maxWidth="sm"
                open={open}
                onClose={onClose}
                onCancel={onClose}
                title={
                    <div className={styles.subHeading}>
                        <ActivitySubjectWithIcon
                            activitySubject={activityObj?.activitySubject}
                            iconURL={activityObj?.activityInteractionIconUrl}
                            activityId={activityObj?.activityId}
                        />
                        {activityObj?.activitySubject}
                    </div>
                }
                onSave={() => {
                    onSave(activityObj, note, leadId);
                    onClose();
                }}
                actionButtonName="Save"
                actionButtonDisabled={activityObj?.activityNote === note || !note || note?.length < 2}
                endIcon={<ArrowForwardWithCircle />}
            >
                <div className={styles.subSection}>
                    <div>
                        <div className={styles.subHeading}>
                            <div className={styles.subHeadingTitle}>{leadFullName}</div>
                        </div>
                        {activityObj &&
                            (type === "Triggered" || activityObj?.activitySubject === "Meeting Recorded") && (
                                <>
                                    <div className={styles.topSection}>
                                        {activityBody_Parser(activityObj?.activityBody)}
                                        <ActivityButtonText
                                            activity={activityObj}
                                            leadsId={leadId}
                                            setDisplay={setDisplay}
                                        />
                                    </div>
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

                        <CreatedDate
                            value={
                                type === "Note" && activityObj?.modifyDate
                                    ? activityObj?.modifyDate
                                    : activityObj?.createDate
                            }
                        />
                    </div>
                </div>
            </Modal>
        </Box>
    );
}
