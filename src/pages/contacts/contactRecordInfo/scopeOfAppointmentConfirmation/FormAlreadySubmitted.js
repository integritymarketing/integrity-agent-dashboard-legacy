import React from "react";
import Container from "components/ui/container";
import Card from "components/ui/card";
import "./index.scss";

export default function FormAlreadySubmitted() {
  return (
    <>
      <Container>
        <Card className="form-already-submitted-card">
          <div className="form-submitted-header">
            Thank you form already submitted.
          </div>
        </Card>
      </Container>
    </>
  );
}
