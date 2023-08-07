import React from "react";
import { Button } from "components/ui/Button";
import ArrowDown from "components/icons/arrow-down";
import "./index.scss";
import Container from "components/ui/container";

const FocusedNav = ({ backText, onBackClick }) => {
  return (
    <div className={"focused-nav"}>
      <Container>
        <div className={"back-button"}>
          <Button
            icon={<ArrowDown />}
            label={backText}
            onClick={onBackClick}
            type="tertiary"
          />
        </div>
      </Container>
    </div>
  );
};

export default FocusedNav;
