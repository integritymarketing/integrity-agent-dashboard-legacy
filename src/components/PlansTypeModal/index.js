import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Modal from 'components/Modal';
import HealthIcon from 'components/icons/healthIcon';
import LifeIcon from 'components/icons/lifeIcon';
import styles from './styles.module.scss';

const PlansTypeModal = ({ showPlanTypeModal, handleModalClose, leadId, zipcode }) => {
  debugger
  const navigate = useNavigate();

  const handleHealthPlanClick = () => {
    if (zipcode) {
      navigate(`/plans/${leadId}`);
    } else {
      navigate(`/contact/${leadId}/addZip`);
    }
  };

  const handleFinalExpensePlanClick = () => {
    if (zipcode) {
      navigate(`/final-expense-plans/${leadId}`);
    } else {
      navigate(`/contact/${leadId}/addZip`);
    }
  };

  return (
    <Modal
      open={showPlanTypeModal}
      onClose={handleModalClose}
      hideFooter
      title="Choose Plan Type"
    >
      <div className={styles.container}>
        <div className={styles.plan} onClick={handleHealthPlanClick}>
          <div className={styles.icon}>
            <HealthIcon />
          </div>
          <div className={styles.title}>Health</div>
        </div>
        <div className={styles.plan} onClick={handleFinalExpensePlanClick}>
          <div className={styles.icon}>
            <LifeIcon />
          </div>
          <div className={styles.title}>Life</div>
        </div>
      </div>
    </Modal>
  );
};

PlansTypeModal.propTypes = {
  showPlanTypeModal: PropTypes.bool.isRequired, // Determines if the modal is open
  handleModalClose: PropTypes.func.isRequired, // Function to call when closing the modal
  leadId: PropTypes.number.isRequired, // Lead ID for navigation
  zipcode: PropTypes.string.isRequired, // zip code value
};

export default PlansTypeModal;
