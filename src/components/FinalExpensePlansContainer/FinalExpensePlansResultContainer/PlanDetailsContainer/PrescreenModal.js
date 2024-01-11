import Modal from "components/Modal";

import styles from "./PlanDetailsContainer.module.scss";

import {
    ELIGIBILTY_NOTES,
    PRESCREEN_AVAILABLE,
    PRESCREEN_AVAILABLE_NOTES,
    PRESCREEN_NOTES,
    PRESCREEN_NOT_AVAILABLE_NOTES,
} from "../FinalExpensePlansResultContainer.constants";

export const PrescreenModal = ({ isOpen, onClose, eligibility, conditionList }) => {
    return (
        <Modal open={isOpen} onClose={onClose} title={ELIGIBILTY_NOTES} hideFooter>
            <div className={styles.contentBox}>
                {conditionList.length > 0
                    ? PRESCREEN_NOTES
                    : eligibility === PRESCREEN_AVAILABLE
                    ? PRESCREEN_AVAILABLE_NOTES
                    : PRESCREEN_NOT_AVAILABLE_NOTES}
                <ul>
                    {conditionList.map(({ name, lookBackPeriod }) => {
                        return (
                            <li key={name}>{`${name} ${lookBackPeriod ? `within ${lookBackPeriod} months` : ""}`}</li>
                        );
                    })}
                </ul>
            </div>
        </Modal>
    );
};
