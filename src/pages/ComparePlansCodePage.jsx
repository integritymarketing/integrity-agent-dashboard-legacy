import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import useToast from "hooks/useToast";

import { Button } from "components/ui/Button";
import Card from "components/ui/card";
import Textfield from "components/ui/textfield";

import Header from "../partials/blue-header";
import Footer from "../partials/email-footer";
import ResendCode from "partials/resend-code";
import WelcomeEmailUser from "partials/welcome-email-user";

import { useClientServiceContext } from "services/clientServiceProvider";

import "./ComparePlansCodePage.scss";
import ComparePlansPage from "./ComparePlansPage";

function ComparePlansCodePage() {
    const showToast = useToast();
    const { request, token } = useParams();
    const [verificationCode, setVerificationCode] = useState("");
    const [code, setCode] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [agentInfo, setAgentInfo] = useState({});
    const [resendCode, setResendCode] = useState(false);
    const { plansService } = useClientServiceContext();

    useEffect(() => {
        plansService.getPassCodeToken(token).then((response) => setCode(response));
        const result = JSON.parse(window.atob(request));
        setAgentInfo(result);
    }, [token, request, plansService]);

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

    // Simplifying isComingFromEmail calculation
    const isComingFromEmail = Object.keys(agentInfo).length > 0;

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
                <title>Integrity - Compare plans</title>
            </Helmet>
            <Header agentInfo={agentInfo} />
            {isValid === false ? (
                <div className="compare-plans-content mt-2">
                    <WelcomeEmailUser firstName={agentInfo.LeadFirstName} lastName={agentInfo.LeadLastName} />
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

                        <Button className="mt-4" label="Submit" type="primary" onClick={handleSubmit} />
                    </Card>
                </div>
            ) : (
                <ComparePlansPage
                    isComingFromEmail={isComingFromEmail}
                    agentInfo={agentInfo}
                    footer={false}
                />
            )}
            <Footer />
        </>
    );
}

export default ComparePlansCodePage;