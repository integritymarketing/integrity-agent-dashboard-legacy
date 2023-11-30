import Box from "@mui/material/Box";
import { StageCell } from "pages/ContactsList/ContactsTable/StageCell";
import { useLeadDetails } from "providers/ContactDetails";
import { ContactsListProvider } from "pages/ContactsList/providers/ContactsListProvider";
import { StageStatusProvider } from "contexts/stageStatus";

import styles from "./StageContainer.module.scss";

export const StageContainer = () => {
    const { leadDetails, getLeadDetails } = useLeadDetails();

    const refreshData = () => {
        getLeadDetails(leadDetails?.leadsId);
    }

    return (
        <ContactsListProvider>
            <StageStatusProvider>
                <Box className={styles.stage}>
                    {leadDetails &&
                        <>
                            <Box>Stage</Box>
                            <Box sx={{
                                padding: "20px",
                                backgroundColor: "#ffffff",
                                borderRadius: " 8px",
                                marginTop: "20px"
                            }}>
                                <StageCell initialValue={leadDetails?.statusName} originalData={leadDetails} customWidth={"100%"} customRefresh={refreshData} />
                            </Box>
                        </>
                    }
                </Box>
            </StageStatusProvider>
        </ContactsListProvider>
    );
}



