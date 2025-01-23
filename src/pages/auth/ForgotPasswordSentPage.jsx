import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import useFetch from "hooks/useFetch";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import CheckIcon from "components/icons/v2-check";

import ResendButtonWithModal from "partials/resend-email";

import analyticsService from "services/analyticsService";

const ForgotPasswordSentPage = () => {
    const { Post: requestPasswordReset } = useFetch(
        `${import.meta.env.VITE_AUTH_AUTHORITY_URL}/forgotpassword`,
        true,
        true
    );

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/login/forgot-NPN/confirmation/",
        });
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Password Reset Sent</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <ContainerUnAuthenticated>
                    <CheckIcon className="mb-2" />
                    <div className="hdg--3 mb-4">Check your email to complete password reset</div>
                    <div className="text text--secondary" data-gtm="reesend-forgot-password-email">
                        <ResendButtonWithModal
                            resendFn={requestPasswordReset}
                            btnClass={analyticsService.clickClass("forgot-resendnow")}
                        />
                    </div>
                </ContainerUnAuthenticated>
                <FooterUnAuthenticated />
            </div>
        </React.Fragment>
    );
};

export default ForgotPasswordSentPage;
