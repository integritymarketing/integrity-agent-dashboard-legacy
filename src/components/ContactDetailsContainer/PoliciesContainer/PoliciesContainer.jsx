import React from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import EnrollmentHistoryContainer from "../../EnrollmentHistoryContainer/EnrollmentHistoryContainer";
import AEP_PlanReviewBanner from "./AEP_PlanReviewBanner";
import styles from "./PoliciesContainer.module.scss";

export const PoliciesContainer = () => {
    const { leadId } = useParams();

    return (
        <Box className={styles.policiesContainer}>
            <AEP_PlanReviewBanner />
            <EnrollmentHistoryContainer leadId={leadId} />
        </Box>
    );
};
