import React from "react";
import "./renderModalItem.scss";
import { TextButton, Button } from "packages/Button";

function ModalContactText({ buttonOne, buttonTwo }) {
  return (
    <div className="buttons">
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
export default ModalContactText;
