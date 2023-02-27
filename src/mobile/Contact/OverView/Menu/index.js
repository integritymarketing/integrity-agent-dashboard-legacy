import React, { useState } from "react";
import View from "./Icons/view";
import SOA from "./Icons/soa";
import DownArrow from "./Icons/downArrow";
import Contact from "./Icons/contact";
import Settings from "./Icons/settings";
import styles from "./styles.module.scss";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.menuContainer}>
      <div className={styles.selected} onClick={() => setOpen(!open)}>
        <div className={styles.row}>
          <div className={styles.icon}>
            <View />
          </div>
          <div className={styles.name}>Overview</div>
        </div>
        <div className={styles.icon}>
          <DownArrow />
        </div>
      </div>
      {open && (
        <div className={styles.optionsContainer}>
          <div className={styles.options}>
            <div className={`${styles.row} ${styles.selectedItem}`}>
              <div className={styles.icon}>
                <View />
              </div>
              <div className={styles.name}>Overview</div>
            </div>
            <div className={styles.row}>
              <div className={styles.icon}>
                <Contact />
              </div>
              <div className={styles.name}>Details</div>
            </div>
            <div className={styles.row}>
              <div className={styles.icon}>
                <SOA />
              </div>
              <div className={styles.name}>Scope of Appointments</div>
            </div>
            <div className={styles.row}>
              <div className={styles.icon}>
                <Settings />
              </div>
              <div className={styles.name}>Preferences</div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.submitButton}>
              View Available Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
