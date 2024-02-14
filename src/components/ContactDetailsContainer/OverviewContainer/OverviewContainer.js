import React, { useEffect, useState } from "react";

import { Box } from "@mui/system";

import { useLeadDetails } from "providers/ContactDetails";

import useAnalytics from "hooks/useAnalytics";

import { DeleteContactModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteContactModal/DeleteContactModal";
import Container from "components/ui/container";

import { ActivitiesTableContainer } from "./ActivitiesContainer/ActivitiesTableContainer";
import { ClientNotes } from "./ClientNotesContainer/ClientNotes";
import { ContactInfoContainer } from "./ContactInfoContainer/ContactInfoContainer";
import styles from "./OverviewContainer.module.scss";
import { RemindersContainer } from "./RemindersContainer/RemindersContainer";
import { StageContainer } from "./StageContainer/StageContainer";
import TagsContainer from "./TagsContainer/TagsContainer";
import LegacySafeGuard from "./LegacySafeGuard";

export const OverviewContainer = () => {
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();

    const [deleteModalStatus, setDeleteModalStatus] = useState(false);

    const { firstName = "", middleName = "", lastName = "", leadsId, leadTags, statusName } = leadDetails;

    useEffect(() => {
        fireEvent("Contact Overview Page Viewed", {
            leadid: leadsId,
            selection: "start_quote",
            tags: leadTags,
            stage: statusName,
            plan_enroll_profile_created: "Yes",
        });
    }, []);

    return (
        <Container className={styles.outerContainer}>
            <Box className={styles.innerContainer}>
                <Box className={styles.leftSection}>
                    <StageContainer />
                    <TagsContainer />
                    <ContactInfoContainer />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "24px",
                            marginTop: "24px",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{ color: "#F44336", fontSize: "16px", cursor: "pointer" }}
                            onClick={() => setDeleteModalStatus(true)}
                        >
                            Delete Contact
                        </Box>
                    </Box>
                </Box>
                <Box className={styles.rightSection}>
                    <Box>
                        <RemindersContainer />
                        <LegacySafeGuard leadDetails={leadDetails} />
                        <ActivitiesTableContainer />
                        <ClientNotes />
                    </Box>
                </Box>
            </Box>
            {deleteModalStatus && (
                <DeleteContactModal
                    leadId={leadsId}
                    leadName={`${firstName} ${middleName || ""} ${lastName}`}
                    onClose={() => setDeleteModalStatus(false)}
                    open={deleteModalStatus}
                />
            )}
        </Container>
    );
};
