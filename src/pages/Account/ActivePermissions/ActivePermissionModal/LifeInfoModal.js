import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import SAPermissionModal from "./ActivePermissionModal";

function LifeInfoModal({ isModalOpen, setIsModalOpen }) {
    return (
        <SAPermissionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Life Self-Attestation"
            subTitle="Final Expense"
            content={
                <>
                    <Box>
                        Integrity partners with carriers and uplines to automatically update Final Expense Selling
                        Permissions linked to your account. You may Add new permissions or update your Producer ID for
                        Final Expense carriers using the Life Self-Attestation section on the Account screen
                    </Box>
                </>
            }
        />
    );
}

LifeInfoModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default LifeInfoModal;
