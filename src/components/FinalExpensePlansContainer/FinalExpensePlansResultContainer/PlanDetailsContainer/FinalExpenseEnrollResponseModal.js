import Modal from "components/Modal";

import styles from "./PlanDetailsContainer.module.scss";

import {
    CARRIER_SITE_UNAVAILABLE,
    CARRIER_SITE_UNAVAILABLE_DESC,
    PRODUCER_ID_NOT_APPPOINTED,
    PRODUCER_NOT_APPOINTED_DESC,
    VIEW_SELLING_PERMISSIONS,
    AGENT_NOT_CONTRACTED_ERROR
} from "../FinalExpensePlansResultContainer.constants";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

/**
 * Modal component to handle different enrollment response scenarios for Final Expense Plans.
 *
 * @param {boolean} isOpen - Indicates if the modal is open.
 * @param {function} onClose - Function to call when the modal is closed.
 * @param {object} enrollResponse - Response object containing the details of the enrollment.
 */
export const FinalExpenseEnrollResponseModal = ({ isOpen, onClose, enrollResponse }) => {
    const navigate = useNavigate();

    // Determine if the error is due to producer not being appointed
    const isProducerNotAppointed = enrollResponse?.redirectUrl === null &&
        enrollResponse?.errorMessage === AGENT_NOT_CONTRACTED_ERROR;

    // Determine if the error is due to carrier site being unavailable or a 500 internal server error
    const isCarrierSiteUnavailable = enrollResponse?.redirectUrl === null &&
        (enrollResponse?.errorMessage === 'Carrier service request error' ||
            enrollResponse?.statusCode === 500);

    const getTitleAndDescription = () => {
        if (isProducerNotAppointed) {
            return { title: PRODUCER_ID_NOT_APPPOINTED, description: PRODUCER_NOT_APPOINTED_DESC };
        } else if (isCarrierSiteUnavailable) {
            return { title: CARRIER_SITE_UNAVAILABLE, description: CARRIER_SITE_UNAVAILABLE_DESC };
        }
    };

    const { title, description } = getTitleAndDescription();

    return (
        <Modal open={isOpen} onClose={onClose} title={title} titleClassName={styles.modalTitle} hideFooter>
            <div className={styles.errorDesc}>{description}</div>
            {isProducerNotAppointed && (
                <div className={styles.btnWrapper}>
                    <Button
                        label={VIEW_SELLING_PERMISSIONS}
                        className={styles.viewSellingPermissions}
                        onClick={() => navigate("/account/sellingPermissions")}
                        type="primary"
                        icon={<ButtonCircleArrow />}
                        iconPosition="right"
                    />
                </div>
            )}
        </Modal>
    );
};

FinalExpenseEnrollResponseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    enrollResponse: PropTypes.shape({
        isSuccess: PropTypes.bool,
        redirectUrl: PropTypes.string,
        errorMessage: PropTypes.string,
        statusCode: PropTypes.number
    }).isRequired
};

FinalExpenseEnrollResponseModal.defaultProps = {
    isOpen: false
};

export default FinalExpenseEnrollResponseModal;
