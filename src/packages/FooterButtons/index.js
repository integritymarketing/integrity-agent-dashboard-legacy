import React from "react";
import { Button } from "packages/Button";
import styles from "./styles.module.scss";

function FooterButtons({ buttonOne, buttonTwo, dashBoardModal }) {
  return (
    <>
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
      {dashBoardModal && (
        <p className={styles.helpTxt}>
          *This is not your MedicareCENTER Agent Phone Number, which can be
          found on your Account page.
        </p>
      )}
    </>
  );
}
export default FooterButtons;
