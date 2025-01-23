import React from "react";
import { useParams } from "react-router-dom";
import Container from "components/ui/container";
import Card from "components/ui/card";
import Navigation from "partials/blue-nav-with-icon";
import "./index.scss";

export default function ConfirmationPage() {
  const { firstName, lastName } = useParams();
  return (
    <>
      <Navigation />
      <Container>
        <Card className="soa-confirmation-page-card">
          <div className="confirmation-header">
            Thank you for completing the Scope of Sales Appointment Confirmation
            Form
          </div>
          <div className="confirmation-body">
            Your agent {firstName} {lastName} will be notified that this has
            been completed and will follow up with you regarding next steps.
          </div>
        </Card>
      </Container>
    </>
  );
}
