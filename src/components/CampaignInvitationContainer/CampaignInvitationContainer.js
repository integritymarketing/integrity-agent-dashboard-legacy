import { useEffect} from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import CampaignSubHeader from "./CampaignSubHeader";
import CampaignInnerContainer from "./CampaignInnerContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";

export const CampaignInvitationContainer = () => {
    const {
        handleSetDefaultSelection,
        currentPage } = useCampaignInvitation();

    useEffect(() => {
        if(currentPage !== 'Contact_Overview'){
            handleSetDefaultSelection();
        }
    }, []);
    return (
            <Box
                sx={{
                    backgroundColor: "#F1F1F1",
                }}
            >
                <CampaignSubHeader />
                <CampaignInnerContainer />
            </Box>
    );
};

CampaignInvitationContainer.propTypes = {
    /** The title to be displayed in the center of the CampaignInvitationContainer */
    title: PropTypes.string.isRequired,
    /** Function to be called when the back button is clicked */
    onBackClick: PropTypes.func.isRequired,
};