import React from "react";
import { TextButton, Button } from "packages/Button";
import styles from "./styles.module.scss";

function FooterButtons({ buttonOne, buttonTwo }) {
  return (
    <div className={styles.buttons}>
      <TextButton
        variant="text"
        size="medium"
        onClick={() => {
          buttonOne.onClick();
        }}
        disabled={buttonOne.disabled}
      >
        {buttonOne.text}
      </TextButton>

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
