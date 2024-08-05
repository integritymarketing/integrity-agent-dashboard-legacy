import { useEffect } from "react";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import AddZipContainer from "components/AddZipContainer/AddZipContainer";
import { useLeadDetails } from "providers/ContactDetails";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import WithLoader from "components/ui/WithLoader";
import useAnalytics from "hooks/useAnalytics";
 
const ZipCodeInputCard = () => {
    const { handleClose, selectedLead, newLeadDetails } = useCreateNewQuote();
    const leadId = selectedLead?.leadsId;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { fireEvent } = useAnalytics();
    const { isLoadingLeadDetails, getLeadDetails } = useLeadDetails();

    useEffect(() => {
        if (leadId) {
            getLeadDetails(leadId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadId]);
 
    const handleCloseWithEvent = () => {
        fireEvent("New Quote Created With Instant Quote", {
            leadId,
            line_of_business: "Health",
            contactType: newLeadDetails?.firstName ? "New Contact" : "Existing Contact",
        });
        handleClose();
    };
 
    return (
        <Box>
            <WithLoader isLoading={isLoadingLeadDetails}>
                <AddZipContainer
                    isMobile={isMobile}
                    contactId={leadId}
                    quickQuoteModalCallBack={handleCloseWithEvent}
                    pageName="Quick Quote"
                />
            </WithLoader>
        </Box>
    );
};

export default ZipCodeInputCard;
