import Box from "@mui/material/Box";

import PropTypes from "prop-types";
import { useState } from "react";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import { PoliciesProvider } from "providers/ContactDetails/PoliciesProvider";
import PolicyDetailsModal from "components/SharedModals/PolicyDetailsModal/PolicyDetailsModal";
import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";


const BadgeIcon = ({ count, leadData }) => {
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [policyDetails, setPolicyDetails] = useState({});
    const isLife = leadData.policy === "LIFE";
    if (count === 0 || !count) {
        return isLife ? <HeartInactive /> : <HealthInactive />
    };
    const openPolicyModal = () => {
        setShowPolicyModal(true);
        setPolicyDetails(leadData)
    }
    return (
        <>
            <Box position="relative" display="inline-block" onClick={openPolicyModal}>
                {isLife ? <Heartactive /> : <HealthActive />}
            </Box>
            <PoliciesProvider>
                <PolicyDetailsModal
                    showPolicyModal={showPolicyModal}
                    policyDetails={policyDetails}
                    handleModalClose={() => setShowPolicyModal(false)}
                    view={"grid"}
                />
            </PoliciesProvider>
        </>
    );
}

BadgeIcon.propTypes = {
    count: PropTypes.number,
    leadData: PropTypes.object
};

export default BadgeIcon;