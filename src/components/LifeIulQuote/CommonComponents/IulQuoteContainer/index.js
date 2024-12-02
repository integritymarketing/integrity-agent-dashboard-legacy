import { Grid, Box } from "@mui/material";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { IulQuoteHeader } from "../IulQuoteHeader";
import { useParams } from "react-router-dom";
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import styles from "./styles.module.scss";

export const IulQuoteContainer = ({ title, children }) => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <ContactProfileTabBar contactId={contactId} showTabs={false} />

            <Box className={styles.iulQuoteContainer}>
                <Grid container gap={3}>
                    <Grid item md={12}>
                        <IulQuoteHeader title={title} />
                    </Grid>
                    {children}
                </Grid>
            </Box>
        </WithLoader>
    );
};
