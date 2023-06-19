import React, { useState } from "react";
import Media from "react-media";
import { formattedTime } from "utils/dates";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "./LinkContactCircle.svg";
import { ReactComponent as DownloadDashboard } from "./DownloadDashboard.svg";

const formatPhone = (phoneNumber) => {
  if (phoneNumber?.startsWith("+")) {
    phoneNumber = phoneNumber.slice(1);
  }

  // split the phone number into parts
  const areaCode = phoneNumber.slice(1, 4); // 801
  const firstPart = phoneNumber.slice(4, 7); // 679
  const secondPart = phoneNumber.slice(7); // 2276

  // combine the parts into the final format
  const formattedPhoneNumber = `(${areaCode})-${firstPart}-${secondPart}`;
  return formattedPhoneNumber;
};

const UnLinkedCallCard = ({ task }) => {
  const [isMobile, setIsMobile] = useState(false);

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
            {formattedTime(task?.taskDate?.split(" ")[1])}
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
          <p>{formatPhone(task?.phoneNumber)}</p>
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
            onClick={() => console.log("Download clicked")}
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
            onClick={() => console.log("link to contact clicked")}
            type="tertiary"
          />
        </Grid>
      </Grid>
    </div>
  );
};

const UnLinkedCalls = ({ taskList }) => {
  return (
    <>
      <div className="unlink-card-container">
        {taskList.map((data) => {
          return <UnLinkedCallCard key={data.contact} task={data} />;
        })}
      </div>
      {taskList?.length > 5 && (
        <div className="show-more-card">
          <Button type="tertiary" label="Show More" className="show-more-btn" />
        </div>
      )}
    </>
  );
};

export default UnLinkedCalls;
