import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import IconArrowRightLong from "components/icons/arrow-right-long";
import LoginLink from "components/ui/login-link";
import "./index.scss";
import analyticsService from "services/analyticsService";

const RegisterLink = (props) => {
  return (
    <a href={`${process.env.REACT_APP_AUTH_BASE_URL}/register`} {...props}>
      {props.children}
    </a>
  );
};

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
      <GlobalNav className="globalNav--absolute" />

      <Waypoint onEnter={handleEnter} />

      <Container id="main-content" className="container--hero text-center">
        <div
          className={`container--hero__content ${isVisible ? "slidein" : ""}`}
        >
          <h2 className="welcomeHero__title mb-scale-2">
            Welcome to MedicareCENTER
          </h2>

          <p className="welcomeHero__content mb-scale-2">
            A powerful new platform with all you need to increase production
            this upcoming AEP – enrollment tools, CRM, Learning Center and more!
          </p>

          <p className="welcomeHero__content mb-scale-2">
            If this is your first visit to the new MedicareCENTER, you need to
            start by registering your account.
          </p>

          <LoginLink className="btn btn--invert">
            Log-in <IconArrowRightLong className="icon" />
          </LoginLink>

          <p className="mt-scale-2">
            Don't have an account?&nbsp;
            <RegisterLink className="link link--invert link--force-underline">
              Register
            </RegisterLink>
          </p>
        </div>
      </Container>

      <Waypoint onEnter={handleEnter} />
    </div>
  );
};

export default WelcomeHero;
