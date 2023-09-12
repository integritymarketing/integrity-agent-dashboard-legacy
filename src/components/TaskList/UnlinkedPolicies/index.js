import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Media from "react-media";
import PropTypes from "prop-types";

import { Button } from "components/ui/Button";
import { ReactComponent as LinkContactCircle } from "pages/dashbaord/LinkContactCircle.svg";
import enrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";

import "./style.scss";

const UnlinkedPolicyCard = ({ callData, npn }) => {
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const addToast = useToast();

  const handleLinkToContact = useCallback(async () => {
    try {
      const data = await enrollPlansService.getBookOfBusinessBySourceId(
        npn,
        callData?.sourceId
      );
      // If policy data coming from API is null, then we have to pass the existing policy data to the next page
      const stateData = data
        ? {
            ...data,
            page: "Dashboard",
            policyHolder: `${data.consumerFirstName} ${data.consumerLastName}`,
          }
        : {
            ...callData,
            page: "Dashboard",
            policyHolder: `${callData.firstName} ${callData.lastName}`,
          };

      // Redirect to Enrollment Link to Contact page, passing the policy data.
      history.push("/enrollment-link-to-contact", { state: stateData });
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to get enroll plan info.",
        time: 10000,
      });
    }
  }, [addToast, callData, history, npn]);

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

UnlinkedPolicyCard.propTypes = {
  callData: PropTypes.object,
  npn: PropTypes.string,
};

const UnlinkedPolicyList = ({ taskList, npn }) => {
  // Sort the taskList, so that the most recent policy is on top and if the effective date is the same, sort by last name in ascending order
  const sortedPolicyList = [...taskList].sort((a, b) => {
    // Sort by Effective Date in descending order
    if (new Date(a.effectiveDate) < new Date(b.effectiveDate)) return 1;
    if (new Date(a.effectiveDate) > new Date(b.effectiveDate)) return -1;

    // If Effective Date is the same, sort by Last Name in ascending order
    return a.lastName?.localeCompare(b.lastName);
  });
  return (
    <>
      <div className="up-card-container">
        {sortedPolicyList?.map((data, i) => {
          return <UnlinkedPolicyCard callData={data} npn={npn} />;
        })}
      </div>
    </>
  );
};

UnlinkedPolicyList.propTypes = {
  taskList: PropTypes.array,
  npn: PropTypes.string,
};

export default UnlinkedPolicyList;
