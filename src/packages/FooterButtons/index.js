import React from "react";
import { Button } from "packages/Button";
import styles from "./styles.module.scss";

function FooterButtons({ buttonOne, buttonTwo }) {
  return (
    <div className={styles.buttons}>
      <Button
        variant="secondary"
        size="medium"
        disabled={buttonOne.disabled}
        onClick={() => {
          buttonOne.onClick();
        }}
      >
        {buttonOne.text}
      </Button>
      <Button
        variant="primary"
        size="medium"
        disabled={buttonTwo.disabled}
        onClick={() => {
          buttonTwo.onClick();
        }}
      >
        {buttonTwo.text}
      </Button>
    </div>
  );
}
export default FooterButtons;
