import React, { useEffect, useState } from "react";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import { useLeadDetails } from "providers/ContactDetails";
import ContactSectionCard from "packages/ContactSectionCard";

import useAnalytics from "hooks/useAnalytics";
import MarketingBanner from "components/Marketing/MarketingBanner";

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

export const OverviewContainer = ({ isMobile }) => {
    const { leadDetails } = useLeadDetails();
    const { fireEvent } = useAnalytics();

    const [deleteModalStatus, setDeleteModalStatus] = useState(false);

    const {
        firstName = "",
        middleName = "",
        lastName = "",
        leadsId,
        leadTags,
        statusName,
        plan_enroll_profile_created,
    } = leadDetails;

    useEffect(() => {
        fireEvent("Contact Overview Page Viewed", {
            leadid: leadsId,
            selection: "start_quote",
            tags: leadTags,
            stage: statusName,
            plan_enroll_profile_created: plan_enroll_profile_created,
        });
    }, []);

    return (
        <Container className={styles.outerContainer}>
            <Box className={styles.innerContainer}>
                <Box className={styles.leftSection}>
                    <StageContainer />
                    <TagsContainer />
                    <ContactInfoContainer isMobile={isMobile} />
                    {!isMobile && (
                        <Box className={styles.deleteContactSection}>
                            <Box
                                sx={{ color: "#F44336", fontSize: "16px", cursor: "pointer" }}
                                onClick={() => setDeleteModalStatus(true)}
                            >
                                Delete Contact
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box className={styles.rightSection}>
                    <Box>
                        <ContactSectionCard
                            isDashboard
                            title="Memberships"
                            className={styles.membershipStyles}
                            contentClassName={styles.membershipStyles_content}
                        >
                            <Box>
                                <Grid container className={styles.membershipContainer}>
                                    <Grid item xs={12} md={5.9}>
                                        <MarketingBanner leadDetails={leadDetails} page="Contact_Overview" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        md={5.9}
                                        sx={{
                                            marginTop: { xs: "16px", md: "0px" },
                                        }}
                                    >
                                        <LegacySafeGuard leadDetails={leadDetails} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </ContactSectionCard>
                        <RemindersContainer />
                        <ActivitiesTableContainer />
                        <ClientNotes isMobile={isMobile} />
                    </Box>
                </Box>
                {isMobile && (
                    <Box className={styles.deleteContactSection}>
                        <Box
                            sx={{ color: "#F44336", fontSize: "16px", cursor: "pointer" }}
                            onClick={() => setDeleteModalStatus(true)}
                        >
                            Delete Contact
                        </Box>
                    </Box>
                )}
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
