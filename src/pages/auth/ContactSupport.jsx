import React from "react";
import { Helmet } from "react-helmet-async";

import { ContainerUnAuthenticated } from "components/ContainerUnAuthenticated";
import { FooterUnAuthenticated } from "components/FooterUnAuthenticated";
import { HeaderUnAuthenticated } from "components/HeaderUnAuthenticated";
import MailIcon from "components/icons/v2-mail";
import PhoneIcon from "components/icons/v2-phone";

const ContactSupport = () => {
    return (
        <>
            <Helmet>
                <title>Integrity - Contact Support</title>
            </Helmet>
            <div className="content-frame v2">
                <HeaderUnAuthenticated />
                <ContainerUnAuthenticated>
                    <h1 className="hdg hdg--2 mb-1">Contact Support</h1>
                    <p className="text text--secondary mb-3">
                        Call or email one of our support representatives to help resolve your issue.
                    </p>
                    <p className="mb-2 content-center ">
                        <MailIcon />
                        <a href="mailto:support@clients.integrity.com" className="ml-2 link link--force-underline">
                            support@clients.integrity.com
                        </a>
                    </p>
                    <p className="content-center ">
                        <PhoneIcon />
                        <a href="tel:+18888183760" className="ml-2 link link--force-underline">
                            888-818-3760
                        </a>
                    </p>
                </ContainerUnAuthenticated>
                <FooterUnAuthenticated />
            </div>
        </>
    );
};

export default ContactSupport;
