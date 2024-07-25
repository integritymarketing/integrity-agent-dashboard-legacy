import { useEffect } from "react";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import AddZipContainer from "components/AddZipContainer/AddZipContainer";
import { useLeadDetails } from "providers/ContactDetails";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import WithLoader from "components/ui/WithLoader";

const ZipCodeInputCard = () => {
    const { handleAfterZipCodeCard, selectedLead } = useCreateNewQuote();
    const leadId = selectedLead?.leadsId;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { isLoadingLeadDetails, getLeadDetails } = useLeadDetails();

    useEffect(() => {
        if (leadId) {
            getLeadDetails(leadId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadId]);

    return (
        <Box>
            <WithLoader isLoading={isLoadingLeadDetails}>
                <AddZipContainer
                    isMobile={isMobile}
                    contactId={leadId}
                    quickQuoteModalCallBack={handleAfterZipCodeCard}
                />
            </WithLoader>
        </Box>
    );
};

export default ZipCodeInputCard;
