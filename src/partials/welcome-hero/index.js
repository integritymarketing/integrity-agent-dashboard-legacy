import React from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import IconArrowRightLong from "components/icons/arrow-right-long";
import LoginLink from "components/ui/login-link";
import "./index.scss";

const RegisterButton = (props) => {
  return (
    <a href={`${process.env.REACT_APP_AUTH_BASE_URL}/register`} {...props}>
      {props.children}
    </a>
  );
};

const WelcomeHero = () => (
  <div className="welcomeHero content-frame bg-photo text-invert">
    <GlobalNav className="globalNav--absolute" />
    <Container className="container--hero text-center">
      <h2 className="welcomeHero__title mb-scale-2">
        Welcome to MedicareCENTER
      </h2>
      <p className="welcomeHero__content mb-scale-2">
        A powerful new platform with all you need to increase production this
        upcoming AEP – enrollment tools, CRM, Learning Center and more!
      </p>

      <p className="welcomeHero__content mb-scale-2">
        If this is your first visit to the new MedicareCENTER, you need to start
        by registering your account.
      </p>
      <RegisterButton className="btn btn--invert">
        Register Now <IconArrowRightLong className="icon" />
      </RegisterButton>
      <p className="mt-scale-2">
        Already registered a new account?&nbsp;
        <LoginLink className="link link--invert link--force-underline">
          Log-in
        </LoginLink>
      </p>
    </Container>
  </div>
);

export default WelcomeHero;
