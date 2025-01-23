import React, { useState } from "react";
import { Link } from "react-router-dom";
import useQueryParams from "hooks/useQueryParams";
import useClientId from "hooks/auth/useClientId";

const ResendEmail = ({ resendFn, btnClass = "" }) => {
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const params = useQueryParams();
    const clientId = useClientId();

    if (emailError) {
        return (
            <React.Fragment>
                <div className="mt-2 text-body">
                    Sorry, there was a problem resending the email. If the problem persists,{" "}
                    <Link to="/contact-support" className="link link--force-underline">
                        please contact support
                    </Link>
                    .
                </div>
            </React.Fragment>
        );
    }
    if (!emailSent) {
        return (
            <div className="mt-2 text-body">
                Didn’t receive an email?{" "}
                <button
                    type="button"
                    className={`link link--force-underline ${btnClass}`}
                    onClick={async () => {
                        const response = await resendFn(
                            {
                                user_id: params.get("npn"),
                            },
                            true
                        );
                        if (response.status >= 200 && response.status < 300) {
                            setEmailSent(true);
                        } else {
                            setEmailError(true);
                        }
                    }}
                >
                    Resend now
                </button>
            </div>
        );
    }
    return (
        <React.Fragment>
            <div className="mt-2 text-body">
                We have resent the email. <br />
                If the problem persists,{" "}
                <Link to="/contact-support" className="link link--force-underline">
                    please contact support
                </Link>
                .
            </div>
        </React.Fragment>
    );
};

export default ResendEmail;
