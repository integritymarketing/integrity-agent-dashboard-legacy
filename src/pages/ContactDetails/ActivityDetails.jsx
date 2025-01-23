import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import styles from "./ActivityDetails.module.scss";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ArrowForwardWithCircle } from "components/ContactDetailsContainer/OverviewContainer/Icons";
import Modal from "components/Modal";
import useAnalytics from "hooks/useAnalytics";
import ActivityButtonText from "pages/ContactDetails/ActivityButtonText";
import CreatedDate from "./CreatedDate";
import { formatPhoneNumber } from "utils/phones";
import ActivitySubjectWithIcon from "./ActivitySubjectWithIcon";
import ShoppersCard from "components/Shoppers/ShoppersCard";

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
    }, [fireEvent, leadId, activityObj?.activitySubject, pageName]);

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
        if(!data.includes("Call recorded to")) {
            return data;
        }
        const dataParse = data?.split(",");
        return (
            <div className={styles.parsedBody}>
                {dataParse &&
                    dataParse.map((item, index) => (
                        <div className={index > 0 ? "mt-2" : ""} key={index}>
                            {item.includes("Call recorded to")
                                ? `Call recorded to :  ${callRecordFormat(item)}`
                                : item}
                        </div>
                    ))}
            </div>
        );
    };

    const headerTitle = useMemo(() => {
        const value = activityObj?.activitySubject;
        if (value?.toLowerCase()?.includes("shopper priority") && activityObj?.activityTypeName === "Triggered") {
            return "Ask Integrity Suggests";
        } else {
            return value;
        }
    }, [activityObj]);

    const handleSave = async () => {
        try {
            await onSave(activityObj, note, leadId);
            onClose();
        } catch (error) {
            Sentry.captureException(error);
        }
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
                            activitySubject={headerTitle}
                            iconURL={activityObj?.activityInteractionIconUrl}
                            activityId={activityObj?.activityId}
                        />
                        {headerTitle}
                    </div>
                }
                onSave={handleSave}
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
                            headerTitle !== "Ask Integrity Suggests" &&
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
                        {headerTitle === "Ask Integrity Suggests" && activityObj?.activityTypeName === "Triggered" && (
                            <ShoppersCard
                                leadId={leadId}
                                title={activityObj?.activitySubject}
                                content={activityObj?.activityBody}
                                url={activityObj?.activityInteractionURL}
                                icon={activityObj?.activityInteractionIconUrl}
                                activityInteractionLabel={activityObj?.activityInteractionLabel}
                                activityInteractionIcon={activityObj?.activityInteractionIconUrl}
                            />
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

ActivityDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    activityObj: PropTypes.object.isRequired,
    leadFullName: PropTypes.string.isRequired,
    leadId: PropTypes.string.isRequired,
    setDisplay: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired,
};