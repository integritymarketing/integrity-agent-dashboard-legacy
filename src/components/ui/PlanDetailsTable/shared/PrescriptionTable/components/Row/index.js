import React from "react";
import styles from "./Row.module.scss";
import Header from "../Header";

const data = [1, 2, 3];
function Row({ isMobile }) {
  return (
    <>
      {data.map((d, i) => {
        return (
          <div
            key={d}
            className={`${styles.container} ${
              isMobile ? styles.mbContainer : ""
            }`}
          >
            <div className={`${styles.left} ${isMobile ? styles.mbLeft : ""}`}>
              <div>i</div>
              <div className={styles.data}>
                <div className={`${styles.secondaryColor} ${styles.type}`}>
                  Preferred Generic
                </div>
                <div className={`${styles.primaryColor} ${styles.name}`}>
                  MetaMorphin HCL TAB 500MG
                </div>
                <div className={`${styles.secondaryColor} ${styles.dose}`}>
                  30 tablets per month
                </div>
              </div>
            </div>
            <div className={styles.right}>
              {isMobile && <Header isRow={true} isMobile={true} />}
              <div className={styles.top}>
                <div className={styles.cell}>$120</div>
                <div className={styles.cell}>$0.00</div>
                <div className={styles.cell}>$110</div>
                <div className={styles.cell}>$9.01</div>
              </div>
              <div className={styles.bottom}>Restrictions: None</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Row;
