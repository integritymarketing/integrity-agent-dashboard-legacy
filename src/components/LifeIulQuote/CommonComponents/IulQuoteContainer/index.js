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
import PropTypes from "prop-types";

export const IulQuoteContainer = ({ title, children }) => {
    const { contactId } = useParams();
    const { isLoadingLifeIulQuoteDetails } = useLeadDetails();
    const { showFilters, setShowFilters, selectedPlans, handleComparePlanSelect } = useLifeIulQuote();

    return (
        <WithLoader isLoading={isLoadingLifeIulQuoteDetails}>
            {!showFilters && (
                <ContactProfileTabBar
                    contactId={contactId}
                    showTabs={false}
                    backButtonRoute=""
                    backButtonLabel="Back"
                />
            )}
            {showFilters && <IulFilterHeader title={"Filters"} onClick={() => setShowFilters(false)} />}
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

IulQuoteContainer.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default IulQuoteContainer;
