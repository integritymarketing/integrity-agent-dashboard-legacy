import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import SAPermissionModal from "./ActivePermissionModal";
import styles from "./styles.module.scss";

function LifeInfoModal({ isModalOpen, setIsModalOpen }) {
    return (
        <SAPermissionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Life Active Selling Permissions"
            content={
                <>
                    <Box>
                        <div>
                            Integrity partners with carriers and uplines to update Active Selling Permissions for Final Expense.
                        </div>
                        <div className={styles.content}>
                            You may add missing selling permissions or update your Producer ID/Agent Writing Number by using the Self-Attested Permissions section on the Account screen.
                        </div>
                        <div>
                            For additional questions about Selling Permissions or your Producer ID, please contact your carrier or upline.
                        </div>
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