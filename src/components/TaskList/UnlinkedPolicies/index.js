import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Media from "react-media";
import PropTypes from "prop-types";
import LinkContactCircle from "components/icons/BookofBusiness/policySnapshot/linkToContact";
import { Button } from "components/ui/Button";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

import "./style.scss";

const UnlinkedPolicyCard = ({ callData, npn }) => {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const showToast = useToast();
    const { enrollPlansService } = useClientServiceContext();

    const handleLinkToContact = useCallback(async () => {
        try {
            const data = await enrollPlansService.getBookOfBusinessBySourceId(npn, callData?.sourceId);
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
                      policyHolder: callData?.policyHolder || "",
                  };

            // Redirect to Enrollment Link to Contact page, passing the policy data.
            navigate("/enrollment-link-to-contact", { state: stateData });
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to get enroll plan info.",
                time: 10000,
            });
        }
    }, [enrollPlansService, npn, callData, navigate, showToast]);

    return (
        <div className="up-card">
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <Grid container className={"infoContainer"} spacing={2}>
                <Grid item xs={6} alignSelf={!isMobile ? "center" : ""} md={4} className="policy-mobile">
                    <p className="up-name">{callData?.planName}</p>
                    {callData?.policyNumber && (
                        <p>
                            <span className="up-label">Policy ID:</span>
                            <span className="up-info">{callData?.policyNumber}</span>
                        </p>
                    )}
                    <p>
                        <span className="up-label">Carrier:</span>
                        <span className="up-info"> {callData?.carrier}</span>
                    </p>
                </Grid>

                <Grid item xs={6} md={2} alignSelf={!isMobile ? "center" : ""} className="policy-holder-mobile">
                    <div className="up-label-bold">Policy Holder {isMobile ? ":" : ""}</div>
                    <div className="up-info-bold">{callData?.policyHolder || ""}</div>
                </Grid>
                <Grid item xs={6} md={3} alignSelf={"center"} className="policy-button-mobile" />
                <Grid item xs={6} md={3} alignSelf={"center"} className="policy-button-mobile">
                    <Button
                        icon={<LinkContactCircle color="#ffffff" />}
                        label="Link to contact"
                        className="up-card-link-btn"
                        onClick={handleLinkToContact}
                        iconPosition="right"
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

const UnlinkedPolicyList = ({ npn, policyList, showMore, setPage }) => {
    // Sort the policyList, sort by last name in ascending order, effective date in ascending order

    const sortedUnlinkedPolicies = useMemo(() => {
        return [...policyList].sort((a, b) => {
            // Null check and default value assignment
            const effectiveDateA = a?.policyEffectiveDate || "";
            const effectiveDateB = b?.policyEffectiveDate || "";
            const lastNameA = a?.lastName || "";
            const lastNameB = b?.lastName || "";

            // Compare by Effective Date in descending order
            const effectiveDateComparison = effectiveDateB.localeCompare(effectiveDateA);
            if (effectiveDateComparison !== 0) {
                return effectiveDateComparison;
            }

            // Compare by Last Name in ascending order
            return lastNameA.localeCompare(lastNameB);
        });
    }, [policyList]);

    return (
        <>
            <div className="up-card-container">
                {sortedUnlinkedPolicies?.map((data, i) => {
                    return <UnlinkedPolicyCard key={i} callData={data} npn={npn} />;
                })}
                {showMore && (
                    <div className="jumpList-card">
                        <Button type="tertiary" onClick={setPage} label="Show More" className="jumpList-btn" />
                    </div>
                )}
            </div>
        </>
    );
};

UnlinkedPolicyList.propTypes = {
    policyList: PropTypes.array,
    npn: PropTypes.string,
};

export default UnlinkedPolicyList;
