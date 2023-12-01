import React from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import HealthIcon from "components/icons/healthIcon";
import LifeIcon from "components/icons/lifeIcon";
import styles from "./styles.module.scss";

const PlansTypeModal = ({
  isModalOpen,
  handleModalClose,
  handleHealthPlanClick,
  handleFinalExpensePlanClick,
}) => (
  <Modal
    open={isModalOpen}
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

PlansTypeModal.propTypes = {
  // If the modal is open
  isModalOpen: PropTypes.bool.isRequired,
  // Function to close the modal
  handleModalClose: PropTypes.func.isRequired,
  // Function called when Health plan is selected
  handleHealthPlanClick: PropTypes.func.isRequired,
  // Function called when Final Expense plan is selected
  handleFinalExpensePlanClick: PropTypes.func.isRequired,
};

export default PlansTypeModal;
