import React from "react";
import Box from "@mui/material/Box";
import HealthDetailsSection from "./HealthSection/HealthSection";
// import { HealthContext } from "providers/ContactDetails/ContactDetailsContext";

import styles from "./HealthContainer.module.scss";
import HealthInfoContainer from "./HealthInfoContainer/HealthInfoContainer";

export const HealthContainer = () => {
    // const { leadId } = useParams();

    // useEffect(() => {
    //     fetchPrescriptions(leadId);
    //     fetchPharmacies(leadId);
    //     fetchProviders(leadId);
    // }, [fetchPrescriptions, fetchPharmacies, fetchProviders]);
    return (
        <>
            <Box className={styles.healthContainer}>
                <HealthInfoContainer />
                <HealthDetailsSection />
            </Box>
        </>
    );
};