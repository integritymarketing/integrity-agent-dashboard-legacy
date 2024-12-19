import { Grid, Box } from "@mui/material";
import { ContactProfileTabBar } from "components/ContactDetailsContainer";
import { IulQuoteHeader } from "../IulQuoteHeader";
import { IulFilterHeader } from "../QuoteFilterHeader";
import { useParams } from "react-router-dom";
import WithLoader from "components/ui/WithLoader";
import { useLeadDetails } from "providers/ContactDetails";
import { useLifeIulQuote } from "providers/Life";
import { ComparePlanFooter } from "@integritymarketing/clients-ui-kit";
import styles from "./styles.module.scss";

export const IulQuoteContainer = ({ title, children }) => {
    const { contactId } = useParams();
    const { isLoadingLeadDetails } = useLeadDetails();
    const { showFilters, setShowFilters, selectedPlans, handleComparePlanSelect } = useLifeIulQuote();

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            {!showFilters && <ContactProfileTabBar contactId={contactId} showTabs={false} />}
            {showFilters && <IulFilterHeader title={title} onClick={() => setShowFilters(false)} />}
            <Box className={styles.iulQuoteContainer}>
                <Grid container gap={3}>
                    {!showFilters && (
                        <Grid item md={12} xs={12}>
                            <IulQuoteHeader title={title} />
                        </Grid>
                    )}
                    {children}
                </Grid>
            </Box>
            {selectedPlans.length > 0 && <ComparePlanFooter plans={selectedPlans} onClose={handleComparePlanSelect} />}
        </WithLoader>
    );
};
