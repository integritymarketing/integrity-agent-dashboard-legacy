import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";

import IconArrowRightLong from "components/icons/arrow-right-long";
import Container from "components/ui/container";
import LoginLink from "components/ui/login-link";

import PublicNav, { RegisterLink } from "partials/global-nav-v2/public-nav";

import analyticsService from "services/analyticsService";

import "./index.scss";

const WelcomeHero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        analyticsService.fireEvent("event-content-load", {
            pagePath: "/portal-welcome-page/",
        });
    }, []);

    const handleEnter = () => {
        setIsVisible(true);
    };

    return (
        <div className="welcomeHero content-frame bg-photo text-invert">
            <PublicNav />

            <Waypoint onEnter={handleEnter} />

            <Container id="main-content" className="container--hero text-center">
                <div className={`container--hero__content ${isVisible ? "slidein" : ""}`}>
                    <h2 className="welcomeHero__title mt-2">Integrity Agent Portal</h2>
                    <p className="welcomeHero__content p-1 mb-2">
                        <span className="crm-quote-enroll-border" />
                        <span className="crm-quote-enroll">CRM + Quoting + Enrollment</span>
                        <span className="crm-quote-enroll-border" />
                    </p>

                    <p className="welcomeHero__content">
                        The most powerful solution built to make client engagement, tracking, quoting, enrollment and
                        follow-up simple and seamless.
                    </p>

                    <LoginLink className="btn login-btn">
                        Login <IconArrowRightLong className="icon-right" />
                    </LoginLink>

                    <p className="mt-scale-1 mb-2">
                        Don't have an account?&nbsp;
                        <RegisterLink className="link link--force-underline">Register</RegisterLink>
                    </p>
                </div>
            </Container>

            <Waypoint onEnter={handleEnter} />
        </div>
    );
};

export default WelcomeHero;
