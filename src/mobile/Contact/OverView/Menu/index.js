import React from "react";
import View from "./Icons/view";
import SOA from "./Icons/soa";
import DownArrow from "./Icons/downArrow";
import Contact from "./Icons/contact";
import Settings from "./Icons/settings";
import styles from "./styles.module.scss";

const MobileMenu = ({
  handleDisplay,
  handleViewPlans,
  setMenuToggle,
  menuToggle,
  display,
}) => {
  return (
    <div className={styles.menuContainer}>
      <div
        className={styles.selected}
        onClick={() => setMenuToggle(!menuToggle)}
      >
        <div className={styles.row}>
          <div className={styles.name}>{display}</div>
        </div>
        <div className={styles.icon}>
          <DownArrow />
        </div>
      </div>
      {menuToggle && (
        <div className={styles.contentCenter}>
          <div className={styles.optionsContainer}>
            <div className={styles.options}>
              <div
                className={`${styles.row} ${
                  display === "OverView" ? styles.selectedItem : ""
                }`}
                onClick={() => handleDisplay("OverView")}
              >
                <div className={styles.icon}>
                  <View />
                </div>
                <div className={styles.name}>Overview</div>
              </div>
              <div
                className={`${styles.row} ${
                  display === "Details" ? styles.selectedItem : ""
                }`}
                onClick={() => handleDisplay("Details")}
              >
                <div className={styles.icon}>
                  <Contact />
                </div>
                <div className={styles.name}>Details</div>
              </div>
              <div
                className={`${styles.row} ${
                  display === "ScopeOfAppointment" ? styles.selectedItem : ""
                }`}
                onClick={() => handleDisplay("ScopeOfAppointment")}
              >
                <div className={styles.icon}>
                  <SOA />
                </div>
                <div className={styles.name}>Scope of Appointments</div>
              </div>
              <div
                className={`${styles.row} ${
                  display === "Preferences" ? styles.selectedItem : ""
                }`}
                onClick={() => handleDisplay("Preferences")}
              >
                <div className={styles.icon}>
                  <Settings />
                </div>
                <div className={styles.name}>Preferences</div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              {handleViewPlans(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
