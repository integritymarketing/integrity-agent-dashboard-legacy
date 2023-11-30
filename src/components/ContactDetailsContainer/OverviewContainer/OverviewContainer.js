import React, { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { RemindersContainer } from "./RemindersContainer/RemindersContainer";
import { ActivitiesTableContainer } from "./ActivitiesContainer/ActivitiesTableContainer";
import { ClientNotes } from "./ClientNotesContainer/ClientNotes";
import TagsContainer from "./TagsContainer/TagsContainer";
import { ContactInfoContainer } from "./ContactInfoContainer/ContactInfoContainer";
import Label from "./CommonComponents/Label";
import { StageContainer } from "./StageContainer/StageContainer";
import { useLeadDetails } from "providers/ContactDetails";
import { DeleteContactModal } from "components/ContactDetailsContainer/ContactDetailsModals/DeleteContactModal/DeleteContactModal";
import { formatDate } from "utils/dates";

const NOT_AVAILABLE = "N/A";
export const OverviewContainer = () => {
    const { leadDetails } = useLeadDetails();

    const [deleteModalStatus, setDeleteModalStatus] = useState(false);


    let {
        firstName = "",
        middleName = "",
        lastName = "",
        createDate,
        leadsId,
    } = leadDetails;

    const leadCreatedDate = useMemo(() => {
        return createDate ? formatDate(createDate, "MM-dd-yyyy") : NOT_AVAILABLE;
    }, [leadDetails]);

    return (
        <Box sx={{ padding: "2rem 7rem" }}>
            <Grid container spacing={2}>
                {/* First Row */}
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={3}>
                        <div>
                            <StageContainer />
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <div>
                            <RemindersContainer />
                        </div>
                    </Grid>
                </Grid>

                {/* Second Row */}
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={3}>
                        <TagsContainer />
                    </Grid>
                    <Grid item xs={9}>
                        <div>
                            <ActivitiesTableContainer />
                        </div>
                    </Grid>
                </Grid>

                {/* Third Row */}
                <Grid item xs={12} container spacing={3}>
                    <Grid item xs={3}>
                        <ContactInfoContainer />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "24px",
                                marginTop: "24px",
                                flexDirection: "column",

                            }}>
                            <Label value={`Created Date: ${leadCreatedDate}`} color="#717171" size="14px" />
                            <Box sx={{ color: "#F44336", fontSize: "16px", cursor: "pointer" }} onClick={() => setDeleteModalStatus(true)}> Delete Contact </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <div>
                            <ClientNotes />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            {deleteModalStatus && (
                <DeleteContactModal
                    leadId={leadsId}
                    leadName={`${firstName} ${middleName || ""} ${lastName}`}
                    onClose={() => setDeleteModalStatus(false)}
                    open={deleteModalStatus}
                />
            )}
        </Box >
    );
};
