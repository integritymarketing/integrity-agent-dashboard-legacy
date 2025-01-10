import PropTypes from "prop-types";

import { Box } from "@mui/material";

import HealthActive from "components/icons/version-2/HealthActive";
import HealthInactive from "components/icons/version-2/HealthInactive";
import Heartactive from "components/icons/version-2/HeartActive";
import HeartInactive from "components/icons/version-2/HeartInactive";
import { useState } from "react";
import CardBadge from "pages/ContactsList/ContactsCard/CardBadge/CardBadge";
import { PoliciesProvider } from "providers/ContactDetails/PoliciesProvider";
import PolicyDetailsModal from "components/SharedModals/PolicyDetailsModal/PolicyDetailsModal";

const HealthLifeCell = ({ row }) => {
    const { firstName, lastName, leadsId, lifePolicyCount = 0, healthPolicyCount = 0 } = row;
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [policyDetails, setPolicyDetails] = useState({});

    const openPolicyModal = (leadData) => {
        setShowPolicyModal(true);
        setPolicyDetails(leadData);
    };

    const renderHealthIcon = () => {
        return (
            <Box
                position="relative"
                display="inline-block"
                onClick={() => openPolicyModal({ firstName, lastName, leadsId, policy: "HEALTH" })}
            >
                <CardBadge IconComponent={<HealthActive />} count={healthPolicyCount} />
            </Box>
        );
    };

    const renderLifeIcon = () => {
        return (
            <Box
                position="relative"
                display="inline-block"
                onClick={() => openPolicyModal({ firstName, lastName, leadsId, policy: "LIFE" })}
            >
                <CardBadge IconComponent={<Heartactive />} count={lifePolicyCount} />
            </Box>
        );
    };

    return (
        <>
            <Box display="flex" gap="20px" alignItems="center">
                {lifePolicyCount > 0 ? renderLifeIcon() : <HeartInactive />}
                {healthPolicyCount > 0 ? renderHealthIcon() : <HealthInactive />}
            </Box>
            <PoliciesProvider>
                <PolicyDetailsModal
                    showPolicyModal={showPolicyModal}
                    policyDetails={policyDetails}
                    handleModalClose={() => setShowPolicyModal(false)}
                    view={"list"}
                />
            </PoliciesProvider>
        </>
    );
};

HealthLifeCell.propTypes = {
    row: PropTypes.shape({
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
        leadsId: PropTypes.string,
        leadSource: PropTypes.string,
        lifePolicyCount: PropTypes.number,
        healthPolicyCount: PropTypes.number,
    }),
};

export default HealthLifeCell;
