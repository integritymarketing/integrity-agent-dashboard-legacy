import React, { useState } from "react";
import Media from "react-media";
import Grid from "@mui/material/Grid";
import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "pages/dashbaord/LinkContactCircle.svg";
import { useHistory } from "react-router-dom";
import enrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import "./style.scss";

const UnlinkedPolicyCard = ({ callData, npn }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const addToast = useToast();

  const handleLinkToContact = async () => {
    try {
      const data = await enrollPlansService.getBookOfBusinessBySourceId(
        npn,
        callData?.sourceId
      );
      if (data) {
        history.push(`/enrollment-link-to-contact`, {
          state: {
            ...data,
            page: "Dashboard",
            policyHolder: `${data.consumerFirstName} ${data.consumerLastName}`,
          },
        });
      } else {
        history.push(`/enrollment-link-to-contact`, {
          state: {
            ...callData,
            page: "Dashboard",
            policyHolder: `${callData.firstName} ${callData.lastName}`,
          },
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to get enroll plan info.",
        time: 10000,
      });
    }
  };

  return (
    <div className="up-card">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Grid container className={"infoContainer"} spacing={2}>
        <Grid
          item
          xs={6}
          alignSelf={!isMobile ? "center" : ""}
          md={5}
          className="policy-mobile"
        >
          <p className="up-name">{callData?.planName}</p>
          {callData?.policyNumber && (
            <p>
              <span className="up-label">Policy ID:</span>
              <span className="up-info">{callData?.policyNumber}</span>
            </p>
          )}
          <p>
            <span className="up-label">Carrier:</span>
            <span className="up-info"> {callData?.policyCarrier}</span>
          </p>
        </Grid>

        <Grid
          item
          xs={6}
          md={3}
          alignSelf={!isMobile ? "center" : ""}
          className="policy-holder-mobile"
        >
          <div className="up-label-bold">
            Policy Holder {isMobile ? ":" : ""}
          </div>
          <div className="up-info-bold">
            {`${callData?.firstName}   ${callData?.lastName}`}
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          md={4}
          alignSelf={"center"}
          className="policy-button-mobile"
        >
          <Button
            icon={<LinkContactCircle />}
            label={"Link to contact"}
            className={"unlink-card-link-btn"}
            onClick={handleLinkToContact}
            type="tertiary"
            style={isMobile ? { padding: "11px 6px" } : {}}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const UnlinkedPolicyList = ({ taskList, npn }) => {
  return (
    <>
      <div className="up-card-container">
        {taskList?.map((data, i) => {
          return <UnlinkedPolicyCard callData={data} npn={npn} />;
        })}
      </div>
    </>
  );
};

export default UnlinkedPolicyList;
