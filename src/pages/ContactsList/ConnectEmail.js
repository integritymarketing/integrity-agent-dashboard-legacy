import { Box } from "@mui/material";
import useAnalytics from "hooks/useAnalytics";
import Connectemail from "components/icons/version-2/ConnectEmail";
import { useCallback } from "react";

const NOT_AVAILABLE = "N/A";

const ConnectEmail = ({ emails = [] }) => {
    const email = emails.length > 0 ? emails[0]?.leadEmail : NOT_AVAILABLE;
    const { fireEvent } = useAnalytics();
    const handleEmail = useCallback(() => {
        if (email !== NOT_AVAILABLE) {
            fireEvent("Contact List Tag Viewed", {
                leadid: leadId,
                view,
                tag_category: "connect",
                content: "email",
            });
            window.location.href = `mailto:${email}`;
        }
    }, [email]);

    return <Box position="relative" display="inline-block" sx={{ left: "12px" }} onClick={handleEmail}>
        <Connectemail />
    </Box >
}

export default ConnectEmail;