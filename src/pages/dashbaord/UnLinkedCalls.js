import React, { useState } from "react";
import Media from "react-media";
import { dateFormatter } from "utils/dateFormatter";
import moment from "moment";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "./LinkContactCircle.svg";
import { ReactComponent as DownloadDashboard } from "./DownloadDashboard.svg";
import { convertUTCDateToLocalDate } from "utils/dates";
import { useHistory } from "react-router-dom";
import { formatPhoneNumber } from "utils/phones";

const UnLinkedCallCard = ({ task }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();

  const linkToContact = () => {
    const date = convertUTCDateToLocalDate(task?.taskDate);
    history.push(
      `/link-to-contact/${task?.id}/${task?.phoneNumber}/${task?.duration}/${date}`
    );
  };

  return (
    <div className="unlink-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} sx={{ color: "#434A51" }}>
          <p>
            <span className="date-time-duration-text">Date:</span>{" "}
            {task?.taskDate?.split(" ")[0]}
          </p>
          <p>
            <span className="date-time-duration-text">Time:</span>{" "}
            {dateFormatter(task?.taskDate, "h:m A")}
          </p>
          <p>
            <span className="date-time-duration-text">Duration:</span>{" "}
            {task?.duration}
          </p>
        </Grid>
        <Grid
          item
          xs={6}
          md={3}
          alignSelf={"center"}
          sx={{ textAlign: "center", color: "#434A51" }}
        >
          <p> {formatPhoneNumber(task?.phoneNumber, true)}</p>
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

const UnLinkedCalls = ({ taskList }) => {
  const sortedTasks = taskList.sort((a, b) =>
    moment(b.taskDate, "MM/DD/YYYY HH:mm:ss").diff(
      moment(a.taskDate, "MM/DD/YYYY HH:mm:ss")
    )
  );

  return (
    <>
      <div className="unlink-card-container">
        {sortedTasks.map((data) => {
          return <UnLinkedCallCard key={data.contact} task={data} />;
        })}
      </div>
    </>
  );
};

export default UnLinkedCalls;
