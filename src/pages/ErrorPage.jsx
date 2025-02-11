import React, { useState } from "react";
import { Link } from "react-router-dom";

import useQueryParams from "hooks/useQueryParams";

import Container from "components/ui/container";
import LoginLink from "components/ui/login-link";
import Modal from "components/ui/modal";

import ContactInfo from "partials/contact-info";
import GlobalNav from "partials/global-nav-v2";
import SimpleFooter from "partials/simple-footer";

const useHelpLinkWithModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    return [
        (props) => (
            <button
                className="link link--inherit link--body"
                type="button"
                onClick={() => setModalOpen(true)}
                {...props}
            ></button>
        ),
        () => (
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <ContactInfo />
            </Modal>
        ),
    ];
};

const getMessageForCode = (code) => {
    switch (code) {
        case "third_party_notauthorized":
            return "We were unable to connect you to this service over SSO.";
        case "login_callback_error":
            return "But something went wrong during the login process.";
        default:
            return "But something went wrong";
    }
};

const ErrorPage = () => {
    const [HelpLink, HelpModal] = useHelpLinkWithModal();
    const params = useQueryParams();
    const errorMessage = getMessageForCode(params.get("code"));

    return (
        <div className="content-frame bg-neutral-gradient text-invert">
            <GlobalNav menuHidden={true} className="mb-auto" />
            <Container id="main-content">
                <div className="hdg hdg--2">Sorry</div>

                <p className="text-body text-body--large mb-4">
                    {errorMessage}
                    <br />
                    Please try again or <HelpLink>contact support</HelpLink> for further assistance.
                </p>

                <div>
                    {params.get("code") === "login_callback_error" ? (
                        <LoginLink className="btn btn--invert">Login</LoginLink>
                    ) : (
                        <Link className="btn btn--invert" to="/">
                            Back to Integrity
                        </Link>
                    )}
                </div>
                <HelpModal />
            </Container>
            <SimpleFooter className="global-footer--simple" />
        </div>
    );
};

export default ErrorPage;
