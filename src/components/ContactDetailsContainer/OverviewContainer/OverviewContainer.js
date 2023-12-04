import React, { useMemo, useState } from "react";

import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";

import { useLeadDetails } from "providers/ContactDetails";

import { formatDate } from "utils/dates";

import { DeleteContactModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteContactModal/DeleteContactModal";

import { ActivitiesTableContainer } from "./ActivitiesContainer/ActivitiesTableContainer";
import { ClientNotes } from "./ClientNotesContainer/ClientNotes";
import Label from "./CommonComponents/Label";
import { ContactInfoContainer } from "./ContactInfoContainer/ContactInfoContainer";
import styles from "./OverviewContainer.module.scss";
import { RemindersContainer } from "./RemindersContainer/RemindersContainer";
import { StageContainer } from "./StageContainer/StageContainer";
import TagsContainer from "./TagsContainer/TagsContainer";

const NOT_AVAILABLE = "N/A";
export const OverviewContainer = () => {
    const { leadDetails } = useLeadDetails();

    const [deleteModalStatus, setDeleteModalStatus] = useState(false);

    let { firstName = "", middleName = "", lastName = "", createDate, leadsId } = leadDetails;

    const leadCreatedDate = useMemo(() => {
        return createDate ? formatDate(createDate, "MM-dd-yyyy") : NOT_AVAILABLE;
    }, [leadDetails]);

    return (
        <Box>
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
                        <Label value={`Created Date: ${leadCreatedDate}`} color="#717171" size="14px" />
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
        </Box>
    );
};
