import { useState, useCallback } from "react";
import PropTypes from "prop-types";

import styles from "./CallCard.module.scss";

import { getLocalDateTime } from "utils/dates";
import { calculateCallDuration } from "utils/calculateCallDuration";

import Media from "react-media";
import { Paper, Stack, IconButton, Typography, Button } from "@mui/material";
import { CallHistory, CallRecording, InboundCall, OutboundCall } from "@integritymarketing/icons";

const CallCard = ({ call }) => {
    const [isMobile, setIsMobile] = useState(false);

    const isMissedCall = call.callStatusReason === "no-answer";
    const callDuration = isMissedCall ? "Missed" : calculateCallDuration(call.duration);
    const callTime = getLocalDateTime(call.callStartTime)?.time;

    const callIcons = {
        missed: <CallHistory className={styles.callIconSize} size="md" color="#C81E27" />,
        inbound: <InboundCall className={styles.callIconSize} size="md" color="#4178FF" />,
        outbound: <OutboundCall className={styles.callIconSize} size="md" color="#4178FF" />
    };

    return (
        <>
            <Media
                query={"(max-width: 560px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.callCardWrapper}>
                <Paper variant="elevation" elevation={0} square={false} className={styles.callCard}>
                    <Stack direction="column" spacing={1} className={styles.cardContentWrapper}>
                        <div className={styles.callContent}>
                            <IconButton
                                size="lg"
                                color={isMissedCall ? "error" : "primary"}
                                className={`${styles.callIcon} ${isMissedCall ? styles.callIconMissed : styles.callIconAnswered}`}
                            >
                                {isMissedCall ? callIcons.missed : callIcons[call.callType]}
                            </IconButton>
                            <div className={styles.callDetailsWrapper}>
                                <div className={styles.callDetails}>
                                    <div className={styles.callMetadata}>
                                        <Typography variant="h5" className={styles.callDate}>
                                            {getLocalDateTime(call.callStartTime)?.date}
                                        </Typography>
                                        <Typography variant="custom">
                                            {call.hasViewed ? callTime : <strong>{callTime}</strong>}
                                        </Typography>
                                    </div>
                                    <div className={styles.callDuration}>
                                        <Typography variant="body1">
                                            {call.hasViewed ? callDuration : <strong>{callDuration}</strong>}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!isMissedCall &&
                            <div className={styles.callCtasWrapper}>
                                {call.url &&
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        endIcon={<CallRecording color="#4178FF" className={styles.callCtaIcon} />}
                                        onClick={() => window.open(call?.url, "_blank")}
                                        className={styles.callCta}
                                    >
                                        {!isMobile && "Download"}
                                    </Button>
                                }
                            </div>
                        }
                    </Stack>
                    {!call.hasViewed && <div className={`${styles.isUnviewed} ${isMissedCall ? styles.isUnviewedMissed : ""}`}></div>}
                </Paper>
            </div>
        </>
    )
}

CallCard.propTypes = {
    call: PropTypes.shape({
        callType: PropTypes.oneOf(["missed", "inbound", "outbound"]).isRequired,
        callStartTime: PropTypes.string.isRequired,
        duration: PropTypes.string,
        url: PropTypes.string
    }).isRequired
}

export default CallCard;