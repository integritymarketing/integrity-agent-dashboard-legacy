import React from "react";

import Logo from "./images/MedicareCENTER.png";
import "./styles.scss";

export default function index() {
    return (
        <>
            <header className="header-callrecording">
                <div className="header-image-container container-x d-flex justify-content-start align-items-center">
                    <img className="logo-call-recording" src={Logo} alt="Integrity logo" />
                </div>
            </header>
            <section className="masthead">
                <div className="masthead-background-image"></div>
            </section>
            <main>
                <section className="page-content-container">
                    <div className="page-heading">
                        <h1 className="call-recording-h1 container-x">Call Recording Solutions for you!</h1>
                    </div>
                    <div className="decorative-background-image">
                        <div className="page-content container-x">
                            <div className="h2-call-recording">Begining AEP 2023!</div>

                            <p className="paragraph-content">
                                Integrity is helping you stay productive — and compliant.
                            </p>

                            <p className="paragraph-content">
                                We're thrilled about our upcoming Call Recording Solutions. You'll easily be able to
                                record, store and download phone calls, helping you stay compliant. We're bringing you
                                the latest in straightforward technology solutions designed just for agents like you.
                                It's one more way that Integrity has your back!
                            </p>

                            <p className="paragraph-content">
                                Keep an eye out for exciting feature updates — like Call Recording — from Integrity as
                                we all gear up for another great AEP season.
                            </p>
                            <div className="cta-button-container d-flex flex-row justify-content-center align-items-center">
                                <div
                                    className="cta-button1"
                                    onClick={() => window.open("https://www.clients.integrity.com/Welcome", "_blank")}
                                >
                                    Get Started
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="call-recording-footer">
                <div className="footer-container container-x d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="privacy-policy-links col-6 d-flex flex-row align-items-center">
                        <p>
                            <a rel="noopener noreferrer" href="https://www.clients.integrity.com/terms" target="_blank">
                                Terms of Use
                            </a>
                            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            <a
                                rel="noopener noreferrer"
                                href="https://www.clients.integrity.com/privacy"
                                target="_blank"
                            >
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                    <div className="copyright-container col-6 d-flex flex-row align-items-center justify-content-center justify-content-end">
                        <p>© 2022 Integrity. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
