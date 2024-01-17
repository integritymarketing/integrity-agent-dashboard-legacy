import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import MailIcon from "components/icons/v2-mail";
import PhoneIcon from "components/icons/v2-phone";

const ContactSupportInvalidNPN = () => {
    const { npnId } = useParams();
    const navigate = useNavigate();
    const goToForgotPassword = () => {
        navigate(`/forgot-password`);
    };
    return (
        <>
            <Helmet>
                <title>Integrity - Contact Support</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <ContainerUnAuthenticated>
                    <h1 className="hdg hdg--2 mb-3">Something's not right</h1>
                    <span className="npn-text">{npnId}</span>
                    <p className="text text--secondary mt-1 mb-3">
                        The NPN above doesn’t match our registration records. Contact support for assistance.
                    </p>
                    <p className="mb-2 content-center ">
                        <MailIcon />
                        <a href="mailto:support@clients.integrity.com" className="ml-2 link link--force-underline">
                            support@clients.integrity.com
                        </a>
                    </p>
                    <p className="mb-3 content-center ">
                        <PhoneIcon />
                        <a href="tel:+18888183760" className="ml-2 link link--force-underline">
                            888-818-3760
                        </a>
                    </p>
                    <p>
                        <button className="link link--force-underline" onClick={goToForgotPassword}>
                            Try again using a different NPN
                        </button>
                    </p>
                </ContainerUnAuthenticated>
                <FooterUnAuthenticated />
            </div>
        </>
    );
};

export default ContactSupportInvalidNPN;
