import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import styles from './PlanDetailsContainer.module.scss';
import {
    ELIGIBILTY_NOTES,
    PRESCREEN_AVAILABLE,
    PRESCREEN_AVAILABLE_NOTES,
    PRESCREEN_NOTES,
    PRESCREEN_NOT_AVAILABLE_NOTES,
} from '../FinalExpensePlansResultContainer.constants';

export const PrescreenModal = ({ isOpen, onClose, eligibility, conditionList, reason, limits }) => {
    const { maxAge, maxAmount, minAge, minAmount } = useMemo(() => ({
        maxAge: limits?.[0]?.maxAge || 0,
        maxAmount: limits?.[0]?.maxAmount || 0,
        minAge: limits?.[0]?.minAge || 0,
        minAmount: limits?.[0]?.minAmount || 0,
    }), [limits]);

    const reasonMapper = useMemo(() => ({
        MaxAgeExceededReason: reason?.MaxAgeExceeded ? `The applicant's age is above the product limit of ${maxAge} years.` : '',
        MaxFaceAmountExceededReason: reason?.MaxFaceAmountExceeded ? `The requested face amount is above the product limit of $${maxAmount.toLocaleString()}` : '',
        MinAgeNotMetReason: reason?.MinAgeNotMet ? `The applicant's age is below the product limit of ${minAge} years.` : '',
        MinFaceAmountNotMetReason: reason?.MinFaceAmountNotMet ? `The requested face amount is below the product limit of $${minAmount.toLocaleString()}` : '',
        buildReason: reason?.build ? 'The applicant may be ineligible due to height/weight' : '',
    }), [reason, maxAge, maxAmount, minAge, minAmount]);

    const isReasonsAvailable = useMemo(() => !Object.values(reasonMapper).every(val => !val), [reasonMapper]);

    return (
        <Modal open={isOpen} onClose={onClose} title={ELIGIBILTY_NOTES} hideFooter>
            <div className={styles.contentBox}>
                {conditionList.length > 0 || isReasonsAvailable ? PRESCREEN_NOTES :
                    eligibility === PRESCREEN_AVAILABLE ? PRESCREEN_AVAILABLE_NOTES : PRESCREEN_NOT_AVAILABLE_NOTES}
                <ul>
                    {conditionList.map(({ name, lookBackPeriod }) => (
                        <li key={name}>{`${name} ${lookBackPeriod ? `within ${lookBackPeriod} months` : ''}`}</li>
                    ))}
                    {Object.entries(reasonMapper).map(([key, value]) => (
                        value && <li key={key}>{value}</li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};

PrescreenModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eligibility: PropTypes.string.isRequired,
    conditionList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        lookBackPeriod: PropTypes.number,
    })).isRequired,
    reason: PropTypes.shape({
        MaxAgeExceeded: PropTypes.bool,
        MaxFaceAmountExceeded: PropTypes.bool,
        MinAgeNotMet: PropTypes.bool,
        MinFaceAmountNotMet: PropTypes.bool,
        build: PropTypes.bool,
    }),
    limits: PropTypes.arrayOf(PropTypes.shape({
        maxAge: PropTypes.number,
        maxAmount: PropTypes.number,
        minAge: PropTypes.number,
        minAmount: PropTypes.number,
    })),
};

PrescreenModal.defaultProps = {
    reason: {},
    limits: [],
};