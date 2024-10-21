import { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ReactComponent as LinkContactCircle } from "./LinkContactCircle.svg";
import { ReactComponent as DownloadDashboard } from "./DownloadDashboard.svg";
import { Button } from "components/ui/Button";
import { convertUTCDateToLocalDate, convertToLocalDateTime } from "utils/dates";
import { formatPhoneNumber } from "utils/phones";

const UnLinkedCallCard = ({ task }) => {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    const linkToContact = () => {
        const date = convertUTCDateToLocalDate(task?.taskDate);
        navigate(`/link-to-contact/${task?.id}/${task?.phoneNumber}/${task?.duration}/${date}`);
    };

    return (
        <div className="unlink-card">
            <Media
                query={"(max-width: 500px)"}
                onChange={(_isMobile) => {
                    setIsMobile(_isMobile);
                }}
            />
            <Grid container spacing={2}>
                <Grid item xs={6} md={3} alignSelf={"center"}>
                    <p> {formatPhoneNumber(task?.phoneNumber, true)}</p>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box>
                        <span className="date-time-duration-text">Date:</span>
                        {convertToLocalDateTime(task?.taskDate).format("MM/DD/yyyy")}
                    </Box>
                    <Box>
                        <span className="date-time-duration-text">Time:</span>{" "}
                        {convertToLocalDateTime(task?.taskDate).format("h:mm a")}
                    </Box>
                    <p>
                        <span className="date-time-duration-text">Duration:</span> {task?.duration}
                    </p>
                </Grid>
                <Grid
                    item
                    xs={6}
                    md={3}
                    alignSelf={"center"}
                    sx={{
                        textAlign: "right",
                        display: "flex",
                        justifyContent: isMobile ? "flex-start" : "center",
                    }}
                >
                    <Button
                        icon={<DownloadDashboard />}
                        iconOnly={isMobile}
                        label={isMobile ? "" : "Download"}
                        onClick={() => {
                            const recordingUrl = task?.recordingUrl;
                            const link = document.createElement("a");
                            link.href = recordingUrl;
                            link.download = "call_recording.mp3";
                            link.click();
                        }}
                        className={"unlink-card-download-btn"}
                        type="secondary"
                        style={isMobile ? { border: "none" } : {}}
                    />
                </Grid>

                <Grid
                    item
                    xs={6}
                    md={3}
                    alignSelf={"center"}
                    sx={{
                        textAlign: "right",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        icon={<LinkContactCircle />}
                        label={"Link to contact"}
                        className={"unlink-card-link-btn"}
                        onClick={linkToContact}
                        type="tertiary"
                    />
                </Grid>
            </Grid>
        </div>
    );
};

UnLinkedCallCard.propTypes = {
    task: PropTypes.shape({
        taskDate: PropTypes.string,
        id: PropTypes.string,
        phoneNumber: PropTypes.string,
        duration: PropTypes.number,
        recordingUrl: PropTypes.string,
    }),
};

const UnLinkedCalls = ({ taskList }) => {
    return (
        <>
            <div className="unlink-card-container">
                {taskList.map((data) => {
                    return <UnLinkedCallCard key={data.contact} task={data} />;
                })}
            </div>
        </>
    );
};

UnLinkedCalls.propTypes = {
    taskList: PropTypes.arrayOf(
        PropTypes.shape({
            contact: PropTypes.string,
            taskDate: PropTypes.string,
            id: PropTypes.string,
            phoneNumber: PropTypes.string,
            duration: PropTypes.number,
            recordingUrl: PropTypes.string,
        })
    ),
};

export default UnLinkedCalls;
