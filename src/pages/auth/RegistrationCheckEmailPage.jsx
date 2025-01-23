import React from "react";
import { Helmet } from "react-helmet-async";

import useClientId from "hooks/auth/useClientId";
import useFetch from "hooks/useFetch";
import useQueryParams from "hooks/useQueryParams";

import InfoIcon from "components/icons/info";

import ResendButtonWithModal from "partials/resend-email";

import analyticsService from "services/analyticsService";

import BaseConfirmationPage from "pages/auth/BaseConfirmationPage";

const ConfirmationPage = () => {
    const clientId = useClientId();
    const queryParams = useQueryParams();
    const { Post: resendConfirmationEmail } = useFetch(
        `${import.meta.env.VITE_AGENTS_URL}/api/v1.0/Account/ResendVerificationEmail`,
        true
    );
    const isModeError = queryParams.get("mode") === "error";

    return (
        <React.Fragment>
            <Helmet>
                <title>Integrity - Account Registration</title>
            </Helmet>
            <BaseConfirmationPage
                footer={
                    <ResendButtonWithModal
                        resendFn={resendConfirmationEmail}
                        btnClass={analyticsService.clickClass("registration-resendnow")}
                    />
                }
                title={isModeError ? "Something’s not right" : "Confirm your account"}
                body={
                    <React.Fragment>
                        {isModeError && (
                            <p className="mb-2 mt-2">
                                Your account’s email address hasn’t been confirmed. Complete the steps below before
                                logging in or changing your password:
                            </p>
                        )}

                        <div className="pt-1 pb-1 pr-1 pl-1 mb-2 confirm-notification">
                            <InfoIcon />
                            <p>
                                Please confirm your account within <strong>72 hours</strong> to complete registration.
                            </p>
                        </div>
                        <ol className="number-list text-body pt-3">
                            <li>
                                <div>Open the inbox for the email address that you registered with</div>
                            </li>
                            <li>
                                <div>
                                    {clientId === "ILSClient" ? (
                                        <p className="mb-2">
                                            Find the confirmation email from Integrity LeadCENTER
                                            (integrityLeadCENTER@integritymarketing.com)
                                        </p>
                                    ) : (
                                        <p className="mb-2">
                                            Find the confirmation email from Integrity (accounts@clients.integrity.com)
                                        </p>
                                    )}

                                    <p className="text-body text-body--small">
                                        Note: You may need to look in your spam/junk folder
                                    </p>
                                </div>
                            </li>
                            <li>
                                {clientId === "ILSClient" ? (
                                    <div>
                                        Click the confirm button in the email to return to Integrity LeadCENTER for
                                        login
                                    </div>
                                ) : (
                                    <div>Click the confirm button in the email to return to Integrity for login</div>
                                )}
                            </li>
                        </ol>
                    </React.Fragment>
                }
                button={null}
            />
        </React.Fragment>
    );
};

export default ConfirmationPage;
