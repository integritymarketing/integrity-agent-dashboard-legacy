import React from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import SAPermissionModal from "./SAPermissionModal";

function HealthInfoModal({ isModalOpen, setIsModalOpen }) {
    return (
        <SAPermissionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Self-Attested Permissions"
            subTitle="How it Works"
            content={
                <>
                    <Box>
                        You may self-attest to selling permissions in additional states for carriers you're already
                        appointed with in our system for at least one state, per plan year. Self-attested permissions
                        take effect immediately in Quote & eApp, and within 24 hours In MedicareAPP and MedicareLINK.
                    </Box>
                    <Box marginTop={2}>
                        It is your responsibility as the agent to sell compliantly. A self-attested selling permission
                        will be verified with the carrier after 5 days. If the carrier does not verify a self-attested
                        selling permission at that time, the permission will be removed. If you self-attest to an
                        incorrect selling permission, you risk losing credit for any enrollments tied to that
                        permission, as well as your appointment with that carrier.
                    </Box>
                </>
            }
        />
    );
}

HealthInfoModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default HealthInfoModal;
