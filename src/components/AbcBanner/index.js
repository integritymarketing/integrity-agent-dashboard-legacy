import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AbcLearnMoreModal from "./AbcLearnMoreModal";
import AbcGetStartBanner from "./AbcGetStartBanner";
import useToast from "hooks/useToast";
import { useClientServiceContext } from "services/clientServiceProvider";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import moment from "moment";
import * as Sentry from "@sentry/react";

// Main Banner Component
const AbcBanner = ({ show, leadPreference, agentId }) => {
    const [showBanner, setShowBanner] = useState(false);
    const [open, setOpen] = useState(false);

    const showToast = useToast();
    const { clientsService } = useClientServiceContext();
    const { handleCreateCampaignFromContact } = useCampaignInvitation();

    useEffect(() => {
        if (show) {
            setShowBanner(true);
        }
    }, [show]);

    const handleButtonClick = async (action) => {
        try {
            const payload = {
                agentId,
                leadPreference: {
                    ...leadPreference,
                    isAgentMobileBannerDismissed: true,
                    isAgentMobilePopUpDismissed: true,
                },
            };
            const res = await clientsService.updateAgentPreferences(payload);
            if (res) {
                const campaignTitle = "Americans Beneficiary Choice Campaign";
                const currentDateTime = moment().format("MM/DD/YYYY HH:mm");
                const updatedCampaignTitle = `${campaignTitle} ${currentDateTime}`;

                if (action === "send_invite") {
                    handleCreateCampaignFromContact({
                        campaignChannel: "Email",
                        campaignTitle: updatedCampaignTitle,
                        customCampaign: "ABC Campaign",
                        actionType: "",
                    });
                    setOpen(false);
                    sessionStorage.setItem("isAgentMobileBannerDismissed", true);
                    setShowBanner(false);
                }

                if (action === "learn_more") {
                    window.open(`https://beneficiarychoice.org/`, "_blank");
                    setOpen(false);
                    setShowBanner(false);
                }
            }
        } catch (error) {
            showToast({
                type: "error",
                message: "Failed to Save the Preferences.",
                time: 10000,
            });
            Sentry.captureException(error);
        }
    };

    const handleTempBannerClose = () => {
        sessionStorage.setItem("isAgentMobileBannerDismissed", true);
        setShowBanner(false);
    };

    return (
        <>
            {showBanner && (
                <>
                    <AbcGetStartBanner onClose={handleTempBannerClose} onLearnMore={() => setOpen(true)} />
                    <AbcLearnMoreModal
                        open={open}
                        onClose={() => setOpen(false)}
                        handleButtonClick={handleButtonClick}
                    />
                </>
            )}
        </>
    );
};

// PropTypes for component
AbcBanner.propTypes = {
    show: PropTypes.bool, // Boolean to show/hide the banner
    leadPreference: PropTypes.object, // Object containing lead preferences
    agentId: PropTypes.string, // Agent ID
};

export default AbcBanner;
