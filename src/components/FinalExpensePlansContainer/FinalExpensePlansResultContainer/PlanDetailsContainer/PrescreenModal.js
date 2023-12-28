import Modal from "components/Modal";

import styles from "./PlanDetailsContainer.module.scss";

import {
    ELIGIBILTY_NOTES,
    PRESCREEN_AVAILABLE,
    PRESCREEN_AVAILABLE_NOTES,
    PRESCREEN_NOT_AVAILABLE_NOTES,
} from "../FinalExpensePlansResultContainer.constants";

export const PrescreenModal = ({ isOpen, onClose, eligibility }) => {
    return (
        <Modal open={isOpen} onClose={onClose} title={ELIGIBILTY_NOTES} hideFooter>
            <div className={styles.contentBox}>
                {eligibility === PRESCREEN_AVAILABLE ? PRESCREEN_AVAILABLE_NOTES : PRESCREEN_NOT_AVAILABLE_NOTES}
            </div>
        </Modal>
    );
};
