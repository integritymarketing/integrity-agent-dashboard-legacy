import { useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import styles from "./PlanDetailsContainer.module.scss";
import {
    CARRIER_SITE_UNAVAILABLE,
    CARRIER_SITE_UNAVAILABLE_DESC,
    PRODUCER_ID_NOT_APPPOINTED,
    PRODUCER_NOT_APPOINTED_DESC,
    VIEW_SELLING_PERMISSIONS,
} from "../FinalExpensePlansResultContainer.constants";
import { Button } from "components/ui/Button";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

/**
 * Modal component to handle different enrollment response scenarios for Final Expense Plans.
 *
 * @param {boolean} isOpen - Indicates if the modal is open.
 * @param {function} onClose - Function to call when the modal is closed.
 * @param {object} enrollResponse - Response object containing the details of the enrollment.
 */
export const FinalExpenseEnrollResponseModal = ({ isOpen, onClose, enrollResponse }) => {
    // Check if enrollResponse is defined
    const isEnrollResponseDefined = enrollResponse !== undefined && enrollResponse !== null;

    useEffect(() => {
        if (isOpen && isEnrollResponseDefined && enrollResponse.redirectUrl) {
            window.open(enrollResponse.redirectUrl, "_blank");
            onClose(); // Close the modal after opening the link
        }
    }, [isOpen, enrollResponse, onClose, isEnrollResponseDefined]);

    const isProducerNotAppointed = isEnrollResponseDefined && enrollResponse.redirectUrl === null;

    const isCarrierSiteUnavailable =
        isEnrollResponseDefined &&
        enrollResponse.redirectUrl === null &&
        (enrollResponse.errorMessage === "Carrier service request error" || enrollResponse.statusCode === 500);

    const getTitleAndDescription = () => {
        if (isProducerNotAppointed) {
            return { title: PRODUCER_ID_NOT_APPPOINTED, description: PRODUCER_NOT_APPOINTED_DESC };
        } else if (isCarrierSiteUnavailable) {
            return { title: CARRIER_SITE_UNAVAILABLE, description: CARRIER_SITE_UNAVAILABLE_DESC };
        }
        return { title: "", description: "" };
    };

    const { title, description } = getTitleAndDescription();

    if (!title && !description) {
        return null;
    }

    const redirectToSellingPermissions = () => {
        window.location.href = `${import.meta.env.VITE_AUTH_PAW_REDIRECT_URI}/selling-permissions`;
    };

    return (
        <Modal open={isOpen} onClose={onClose} title={title} titleClassName={styles.modalTitle} hideFooter>
            <div className={styles.errorDesc}>{description}</div>
            {isProducerNotAppointed && (
                <div className={styles.btnWrapper}>
                    <Button
                        label={VIEW_SELLING_PERMISSIONS}
                        className={styles.viewSellingPermissions}
                        onClick={redirectToSellingPermissions}
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
        statusCode: PropTypes.number,
    }),
};

FinalExpenseEnrollResponseModal.defaultProps = {
    isOpen: false,
    enrollResponse: null,
};

export default FinalExpenseEnrollResponseModal;
