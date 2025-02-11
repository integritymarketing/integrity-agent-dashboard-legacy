import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useScopeOfAppointment, useLeadDetails } from "providers/ContactDetails";
import useUserProfile from "hooks/useUserProfile";
import OpenIcon from "components/icons/open";
import { Button } from "components/ui/Button";
import { useClientServiceContext } from "services/clientServiceProvider";
import styles from "./ActivityDetails.module.scss";

const buttonTextByActivity = {
    "Incoming Call": "Link to Contact",
    "Call Recording": "Download",
    "Contact's new call log created": "Download",
    "Outbound Call Recorded": "Download",
    "Incoming Call Recorded": "Download",
    "Scope of Appointment Signed": "View",
    "Scope of Appointment Completed": "View",
    "Plan Shared": "View Shared Link",
    "Application Submitted": "View",
    "Meeting Recorded": "Download",
};

const ActivityButtonText = ({ activity, leadsId }) => {
    const { activityTypeName, activityInteractionURL, activitySubject, activityInteractionLabel = "" } = activity;
    const navigate = useNavigate();
    const userProfile = useUserProfile();
    const { npn } = userProfile;
    const { setLinkCode } = useScopeOfAppointment();
    const { setSelectedTab } = useLeadDetails();
    const { comparePlansService } = useClientServiceContext();

    const splitViewPlansURL = activityInteractionURL?.split("/");

    const handleClick = useCallback(async () => {
        try {
            if (activityInteractionLabel) {
                if (activityInteractionLabel === "View Message") {
                    const url = new URL(activityInteractionURL);
                    navigate(url.pathname);
                } else {
                    window.open(activityInteractionURL, "_blank");
                }
            } else {
                switch (activitySubject) {
                    case "Scope of Appointment Signed":
                        setLinkCode(activityInteractionURL);
                        setSelectedTab("scope-of-appointment");
                        navigate(`/contact/${leadsId}/scope-of-appointment`);
                        break;
                    case "Scope of Appointment Completed":
                        setLinkCode(activityInteractionURL);
                        setSelectedTab("view-scope-of-appointment");
                        navigate(`/contact/${leadsId}/view-scope-of-appointment`);
                        break;
                    case "Plan Shared":
                        navigate(`/plans/${leadsId}/compare/${splitViewPlansURL[7]}/${splitViewPlansURL[8]}`);
                        break;
                    case "Incoming Call Recorded":
                    case "Outbound Call Recorded":
                    case "Call Recording":
                    case "Meeting Recorded":
                    case "Contact's new call log created":
                        window.open(activityInteractionURL, "_blank");
                        break;
                    case "Application Submitted":
                        const link = await comparePlansService?.getPdfSource(activityInteractionURL, npn);

                        var url = await window.URL.createObjectURL(link);

                        if (url && url !== "") {
                            window.open(url, "_blank");
                        }
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error("Error handling activity button click:", error);
        }
    }, [
        activityInteractionLabel,
        activityInteractionURL,
        activitySubject,
        setLinkCode,
        setSelectedTab,
        navigate,
        leadsId,
        splitViewPlansURL,
        comparePlansService,
        npn,
    ]);

    const showButton = activityTypeName === "Triggered" && Boolean(activityInteractionURL);
    const buttonText = activityInteractionLabel || buttonTextByActivity[activitySubject] || "View";

    return showButton ? (
        <Button
            icon={<OpenIcon color="#ffffff" />}
            iconPosition="right"
            label={buttonText}
            onClick={handleClick}
            type="tertiary"
            className={styles.activityButton}
        />
    ) : null;
};

ActivityButtonText.propTypes = {
    activity: PropTypes.shape({
        activityTypeName: PropTypes.string.isRequired,
        activityInteractionURL: PropTypes.string,
        activitySubject: PropTypes.string.isRequired,
        activityInteractionLabel: PropTypes.string,
    }).isRequired,
    leadId: PropTypes.string.isRequired,
};

export default ActivityButtonText;
