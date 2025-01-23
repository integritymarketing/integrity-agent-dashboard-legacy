import { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import { useAgentAvailability } from "hooks/useAgentAvailability";
import useUserProfile from "hooks/useUserProfile";

import Dialog from "packages/Dialog";

import { HealthLead } from "./HealthLead";
import { LifeLead } from "./LifeLead";
import { PlanEnroll } from "./PlanEnroll";
import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./styles.module.scss";

function LeadSource() {
    const [openDialog, setOpenDialog] = useState(false);
    const { agentId } = useUserProfile();
    const { leadPreference, agentAvailability } = useAgentAccountContext();
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const { clientsService } = useClientServiceContext();

    useEffect(() => {
        const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;
        const hasActiveHealthCallCampaign = agentAvailability?.activeCampaign?.hasActiveHealthCallCampaign;

        const isLifeCheck = leadPreference?.leadCenterLife && hasActiveLifeCallCampaign;
        const isHealthChecked = hasActiveHealthCallCampaign ? leadPreference?.leadCenter : false;
        const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;
        const shouldChangeStatus = !isLifeCheck && !isHealthChecked && !isPlanEnrollChecked;

        if (shouldChangeStatus && isAvailable) {
            setIsAvailable(false);
            clientsService.updateAgentAvailability({
                agentID: agentId,
                availability: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box className={styles.leadCenter}>
            <Box className={styles.subTitle}>Lead Source</Box>
            <Box className={styles.sectionsWrapper}>
                <HealthLead setShowAvilabilityDialog={setOpenDialog} />
                <LifeLead setShowAvilabilityDialog={setOpenDialog} />
                <PlanEnroll setShowAvilabilityDialog={setOpenDialog} />
            </Box>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Lead Sources Disabled"
                maxWidth="sm"
                titleWithIcon={false}
            >
                You have disabled all lead sources. We have switched off your availability until additional lead sources
                are enabled.
            </Dialog>
        </Box>
    );
}

export default LeadSource;
