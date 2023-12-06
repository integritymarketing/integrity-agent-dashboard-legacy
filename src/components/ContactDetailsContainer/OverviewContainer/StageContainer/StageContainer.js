import Box from "@mui/material/Box";

import { useLeadDetails } from "providers/ContactDetails";

import { StageStatusProvider } from "contexts/stageStatus";

import { StageCell } from "pages/ContactsList/ContactsTable/StageCell";
import { ContactsListProvider } from "pages/ContactsList/providers/ContactsListProvider";

import styles from "./StageContainer.module.scss";

export const StageContainer = () => {
    const { leadDetails, getLeadDetails } = useLeadDetails();

    const refreshData = () => {
        getLeadDetails(leadDetails?.leadsId);
    };

    return (
        <ContactsListProvider>
            <StageStatusProvider>
                <Box className={styles.stage}>
                    {leadDetails && (
                        <>
                            <Box>Stage</Box>
                            <Box className={styles.box}>
                                <StageCell
                                    initialValue={leadDetails?.statusName}
                                    originalData={leadDetails}
                                    customWidth="100%"
                                    customRefresh={refreshData}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </StageStatusProvider>
        </ContactsListProvider>
    );
};
