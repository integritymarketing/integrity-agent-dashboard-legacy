import { useState } from "react";

import Box from "@mui/material/Box";

import Dialog from "packages/Dialog";

import { HealthLead } from "./HealthLead";
import { LifeLead } from "./LifeLead";
import { PlanEnroll } from "./PlanEnroll";

import styles from "./styles.module.scss";

function LeadSource() {
    const [openDialog, setOpenDialog] = useState(false);

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
