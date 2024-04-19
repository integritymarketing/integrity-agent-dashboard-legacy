import { Box } from "@mui/material";
import PropTypes from "prop-types";
import useAnalytics from "hooks/useAnalytics";
import Connectemail from "components/icons/version-2/ConnectEmail";
import { useCallback } from "react";

const NOT_AVAILABLE = "N/A";

const ConnectEmail = ({ data, emails = [], view }) => {
    const email = emails.length > 0 ? emails[0]?.leadEmail : NOT_AVAILABLE;
    const { fireEvent } = useAnalytics();

    const handleEmail = useCallback(() => {
        if (email !== NOT_AVAILABLE) {
            fireEvent("Contact List Tag Viewed", {
                leadid: data.leadsId,
                view,
                tag_category: "connect",
                content: "email",
            });
            window.location.href = `mailto:${email}`;
        }
    }, [email, data.leadsId, view, fireEvent]);

    return (
        <Box position="relative" display="inline-block" sx={{ left: "12px", cursor: "pointer" }} onClick={handleEmail}>
            <Connectemail />
        </Box>
    );
};

ConnectEmail.propTypes = {
    data: PropTypes.shape({
        leadsId: PropTypes.number.isRequired,
    }).isRequired,
    emails: PropTypes.arrayOf(
        PropTypes.shape({
            leadEmail: PropTypes.string,
        })
    ),
    view: PropTypes.string.isRequired,
};

export default ConnectEmail;
