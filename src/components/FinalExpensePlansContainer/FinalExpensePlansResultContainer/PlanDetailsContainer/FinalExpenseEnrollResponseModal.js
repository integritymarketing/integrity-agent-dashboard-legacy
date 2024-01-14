import Modal from "components/Modal";

import styles from "./PlanDetailsContainer.module.scss";

import {
    CARRIER_SITE_UNAVAILABLE,
    CARRIER_SITE_UNAVAILABLE_DESC,
    PLAN_ENROLL_ERROR,
    PRODUCER_ID_NOT_APPPOINTED,
    PRODUCER_NOT_APPOINTED_DESC,
    VIEW_SELLING_PERMISSIONS,
} from "../FinalExpensePlansResultContainer.constants";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

export const FinalExpenseEnrollResponseModal = ({ isOpen, onClose, enrollResponse }) => {

    const isPlanEnrollError = enrollResponse === PLAN_ENROLL_ERROR;

    const title = isPlanEnrollError ? CARRIER_SITE_UNAVAILABLE : PRODUCER_ID_NOT_APPPOINTED;

    const navigate = useNavigate();

    return (
        <Modal open={isOpen} onClose={onClose} title={title} titleClassName={styles.modalTitle} hideFooter>
            <div className={styles.errorDesc}>{isPlanEnrollError ? CARRIER_SITE_UNAVAILABLE_DESC : PRODUCER_NOT_APPOINTED_DESC}</div>
            {!isPlanEnrollError && <div className={styles.btnWrapper}>
                <Button
                    label={VIEW_SELLING_PERMISSIONS}
                    className={styles.viewSellingPermissions}
                    onClick={() => navigate(`/account/sellingPermissions`)}
                    type="primary"
                    icon={<ButtonCircleArrow />}
                    iconPosition="right"
                /></div>}
        </Modal>
    );
};