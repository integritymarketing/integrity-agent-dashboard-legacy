import * as Sentry from "@sentry/react";
import { useState } from "react";
import Media from "react-media";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";

import PropTypes from "prop-types";

import { convertToLocalDateTime, getOverDue } from "utils/dates";

import useToast from "hooks/useToast";

import Person from "components/icons/personLatest";
import RoundCheck from "components/icons/round-check";
import { Button } from "components/ui/Button";

import { useClientServiceContext } from "services/clientServiceProvider";

import "./style.scss";

import ReminderIcon from "images/Reminder.svg";
import Reminder_Overdue from "images/Reminder_Overdue.svg";

const RemindersCard = ({ callData, refreshData }) => {
    const [isMobile, setIsMobile] = useState(false);
    const { clientsService } = useClientServiceContext();
    const navigate = useNavigate();
    const showToast = useToast();

    const isReminderDue = getOverDue(callData?.taskDate);

    const completeReminder = () => {
        const payload = {
            reminderId: callData?.id,
            leadId: callData?.leadId,
            isComplete: true,
        };

        clientsService
            .updateReminder(payload)
            .then(() => {
                showToast({
                    type: "success",
                    message: "Reminder successfully Updated.",
                    time: 3000,
                });
                refreshData(callData?.id);
            })
            .catch((e) => {
                Sentry.captureException(e);
            });
    };

    return (
        <div className="reminder-card">
            <Media
                query={"(max-width: 500px)"}
                onChange={(_isMobile) => {
                    setIsMobile(_isMobile);
                }}
            />
            <Grid container className={"infoContainer"} spacing={2}>
                {!isMobile && (
                    <Grid item xs={6} alignSelf={"center"} md={3}>
                        <p className="reminder-name">{`${callData?.firstName}   ${callData?.lastName}`}</p>
                    </Grid>
                )}

                {isMobile && (
                    <Grid
                        sx={{
                            textAlign: "right",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 20px 0px 20px",
                        }}
                    >
                        <Grid
                            item
                            xs={6}
                            md={3}
                            sx={{
                                textAlign: "right",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                            }}
                        >
                            <p className="reminder-name">{`${callData?.firstName}   ${callData?.lastName}`}</p>
                        </Grid>{" "}
                        <Grid
                            item
                            xs={6}
                            md={3}
                            alignSelf={"center"}
                            sx={{
                                textAlign: "right",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <div className="startedIcon">
                                {isReminderDue ? (
                                    <img src={Reminder_Overdue} alt="rem_due" />
                                ) : (
                                    <img src={ReminderIcon} alt="rem_new" />
                                )}
                            </div>
                            <div className={`reminder-info ${isReminderDue ? "overDue" : ""}`}>
                                {convertToLocalDateTime(callData?.taskDate).format("MM/DD/yyyy")}
                            </div>
                        </Grid>
                    </Grid>
                )}

                <Grid item xs={6} md={3} className="reminder-mobile">
                    <div className="roundIcon" onClick={completeReminder}>
                        <RoundCheck />
                    </div>
                    <div className="reminder-info" title={callData?.remindersNotes}>
                        {callData?.remindersNotes}
                    </div>
                </Grid>
                {!isMobile && (
                    <Grid
                        item
                        xs={6}
                        md={3}
                        alignSelf={"center"}
                        sx={{
                            textAlign: "right",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isMobile ? "flex-start" : "center",
                        }}
                    >
                        <div className="startedIcon">
                            {isReminderDue ? (
                                <img src={Reminder_Overdue} alt="rem_due" />
                            ) : (
                                <img src={ReminderIcon} alt="rem_new" />
                            )}
                        </div>
                        <div className={`reminder-info ${isReminderDue ? "overDue" : ""}`}>
                            {convertToLocalDateTime(callData?.taskDate).format("MM/DD/yyyy")}
                        </div>
                    </Grid>
                )}
                <Grid item xs={6} md={3} alignSelf={"center"} className="reminder-button-mobile">
                    <Button
                        icon={<Person color="#ffffff" />}
                        label={"View Contact"}
                        className={"reminder-card-link-btn"}
                        onClick={() => navigate(`/contact/${callData?.leadId}`)}
                        type="tertiary"
                        style={isMobile ? { padding: "11px 6px" } : {}}
                        iconPosition="right"
                    />
                </Grid>
            </Grid>
        </div>
    );
};

// Define PropTypes for RemindersCard
RemindersCard.propTypes = {
    callData: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        taskDate: PropTypes.string,
        leadId: PropTypes.string,
        remindersNotes: PropTypes.string,
    }),
    refreshData: PropTypes.func,
};

const RemindersList = ({ taskList, refreshData }) => {
    return (
        <>
            <div className="reminder-card-container">
                {taskList?.map((data, i) => {
                    return <RemindersCard key={`reminder-card-${i}`} callData={data} refreshData={refreshData} />;
                })}
            </div>
        </>
    );
};

// Define PropTypes for RemindersList
RemindersList.propTypes = {
    taskList: PropTypes.arrayOf(PropTypes.object),
    refreshData: PropTypes.func,
};

export default RemindersList;
