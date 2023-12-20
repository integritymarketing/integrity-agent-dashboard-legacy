import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Card from "components/ui/card";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import Header from "partials/blue-header";
import Footer from "partials/email-footer";
import ResendCode from "partials/resend-code";
import WelcomeEmailUser from "partials/welcome-email-user";
import plansService from "services/plansService";
import EnrollmentHistoryPage from "pages/EnrollmentHistoryPage";
import useToast from "hooks/useToast";
import "./sharepolicy.scss";

function PolicyCodePage() {
  const showToast = useToast();
  const { request, token } = useParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [agentInfo, setAgentInfo] = useState({});
  const [resendCode, setResendCode] = useState(false);

  useEffect(() => {
    plansService.getPassCodeToken(token).then((response) => setCode(response));
    const result = JSON.parse(window.atob(request));
    setAgentInfo(result);
  }, [token, request]);

  const handleVerificationCode = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleSubmit = () => {
    const isCodeValid = code === verificationCode;
    setIsValid(isCodeValid);
    if (!isCodeValid) {
      showToast({
        type: "error",
        message: "Please enter valid code.",
      });
    }
  };

  const handleResendCode = () => {
    setResendCode(false);
  };

  return (
    <>
      <ResendCode
        agentInfo={agentInfo}
        modalOpen={resendCode}
        close={handleResendCode}
        request={request}
        token={token}
      />
      <Helmet>
        <title>Integrity Clients - Policy Snapshot Details</title>
      </Helmet>
      <Header agentInfo={agentInfo} />
      {isValid === false ? (
        <div className="compare-plans-content mt-2">
          <WelcomeEmailUser
            firstName={agentInfo.LeadFirstName}
            lastName={agentInfo.LeadLastName}
          />
          <Card className="compare-plans-code">
            <h4 className="heading-title">Type code to see plans</h4>
            <div className="content pt-4">
              <span>Code</span>
              <div className="resend-code" onClick={() => setResendCode(true)}>
                Resend Code
              </div>
            </div>
            <Textfield
              id="verification-code"
              placeholder={"Enter Code"}
              name="code"
              value={verificationCode}
              onChange={handleVerificationCode}
            />

            <Button
              className="mt-4"
              label="Submit"
              type="primary"
              onClick={handleSubmit}
            />
          </Card>
        </div>
      ) : (
        <EnrollmentHistoryPage
          isComingFromEmail={Object.keys(agentInfo).length > 0}
          agentInfo={agentInfo}
          footer={false}
        />
      )}
      <Footer />
    </>
  );
}

export default PolicyCodePage;
