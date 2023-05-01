import React from "react";

import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import Back from "components/icons/back";

function GoBackNavbar(props) {
  const history = useHistory();
  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper} onClick={handleGoBack}>
        <Back />
        <button className={styles.backButton}>
          {props.title ? props.title : "back"}
        </button>
      </div>
    </div>
  );
}

export default GoBackNavbar;
