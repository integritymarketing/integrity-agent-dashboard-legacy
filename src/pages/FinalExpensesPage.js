import React from "react";
import GlobalNav from "partials/global-nav-v2";
import { useParams } from "react-router-dom";
import styles from "./PlanDetailsPage.module.scss";
import NewBackBtn from "images/new-back-btn.svg";
import Container from "components/ui/container";
import { Button } from "components/ui/Button";

function FinalExpensesPage() {
  const { contactId } = useParams();

  return (
    <div>
      <GlobalNav />
      <div className={`${styles["header"]}`} style={{ height: "auto" }}>
        <Container className={`${styles["plan-details-container"]}`}>
          <div className={`${styles["back"]}`}>
            <Button
              icon={<img src={NewBackBtn} alt="Back" />}
              label={"Back to Plans"}
              onClick={() => {
                window.location = `/plans/${contactId}?preserveSelected=true`;
              }}
              type="tertiary"
              className={`${styles["back-button"]}`}
            />
          </div>
          <p className={`${styles["header-text"]}`}>Contact Details</p>
        </Container>
      </div>
    </div>
  );
}

export default FinalExpensesPage;
