import React from "react";
import styles from '../AskIntegrityFeedback.module.scss';

const Capabilities = () => (
  <div className={styles.infoContainer}>
    <div className={styles.heading}>Available Capabilities</div>
    <div className={styles.infoItem}>
      <div className={styles.gap}>
        Ask Integrity is just getting started!
      </div>
      <div className={styles.gap}>
        At launch, Ask Integrity will share a set of suggestions indicating what key skills are currently available.
      </div>
      <div className={styles.gap}>
        Additional capabilities will continue to be added. If you have an idea or suggestion, we encourage you to share your feedback!
      </div>
    </div>
  </div>
);

export default Capabilities;
