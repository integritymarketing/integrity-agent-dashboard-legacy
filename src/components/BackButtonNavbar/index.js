import React from "react";
import PropTypes from "prop-types";

import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import Back from "components/icons/back";

function GoBackNavbar(props) {
  const history = useHistory();

  const handleGoBack = () => {
    if (props.handleBackToRoute) {
      props.handleBackToRoute();
    } else {
      history.goBack();
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper} onClick={handleGoBack}>
        <Back />
        <button className={styles.backButton}>
          {props.title ? props.title : "Back"}
        </button>
      </div>
    </div>
  );
}

GoBackNavbar.propTypes = {
  handleBackToRoute: PropTypes.func, // optional function prop
  title: PropTypes.string, // optional string prop
};

export default GoBackNavbar;
