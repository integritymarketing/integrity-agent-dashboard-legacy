import React from 'react';
import PropTypes from 'prop-types';
import styles from '../AskIntegrityFeedback.module.scss';
import ArrowRightCircle from './assets/ArrrowRightCircle';

const Support = ({ onShare, onContactSupport }) => (
  <div className={styles.infoContainer}>
    <div className={styles.heading}>Support</div>
    <div className={styles.infoItem}>
      <div className={styles.gap}>
        <div>
          If you are experiencing any issues with Ask Integrity, we invite you to share your feedback with us so that Ask Integrity can learn and improve.
        </div>
        <div className={styles.buttonContainer} onClick={onShare}>
          <div className={styles.actionButton}>
            Share Feedback
            <ArrowRightCircle />
          </div>
        </div>
      </div>
      <div className={styles.gap}>
        <div>
          For issues with MedicareCENTER outside of Ask Integrity, please contact one of our support representatives.
        </div>
        <div className={styles.buttonContainer} onClick={onContactSupport}>
          <div className={styles.actionButton}>
            Contact Support
          </div>
        </div>
      </div>
    </div>
  </div>
);

Support.propTypes = {
  onShare: PropTypes.func.isRequired,
  onContactSupport: PropTypes.func.isRequired,
};

export default Support;
