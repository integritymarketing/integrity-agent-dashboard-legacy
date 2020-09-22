import React, { useContext } from "react";
import Container from "components/ui/container";
import GlobalNav from "partials/global-nav";
import AuthContext from "contexts/auth";
import useFlashMessage from "hooks/useFlashMessage";
import IconArrowRightLong from "components/icons/arrow-right-long";

import "./index.scss";

const LoginLink = (props) => {
  const auth = useContext(AuthContext);
  const { show: showMessage } = useFlashMessage();

  const login = async () => {
    try {
      await auth.signinRedirect();
    } catch (e) {
      console.error("sign in error", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  };

  return <button type="button" onClick={login} {...props}></button>;
};

const RegisterButton = (props) => {
  return (
    <a href={`${process.env.REACT_APP_AUTH_BASE_URL}/register`} {...props}>
      {props.children}
    </a>
  );
};

const WelcomeHero = () => {
  const hideLogin = parseInt(process.env.REACT_APP_HIDE_LOGIN, 10);

  const getHeroCTA = () => {
    if (hideLogin === 1) {
      return (
        <div className="hide-login">
          <a
            href="https://integrity-ppc.destinationrx.com/PlanCompare/2020/professional/type1/Compare/Home"
            className="btn btn--invert"
          >
            <div>Log in to 2020 MedicareCENTER</div>
            <IconArrowRightLong className="icon" />
          </a>
          <h3 className="font-normal">
            New 2021 MedicareCENTER login on the way!
          </h3>
        </div>
      );
    }
    return (
      <>
        <p className="welcomeHero__content mb-scale-2">
          If this is your first visit to the new MedicareCENTER, you need to
          start by registering your account.
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
      </>
    );
  };

  return (
    <div className="welcomeHero hide-login content-frame bg-photo text-invert">
      <GlobalNav className="globalNav--absolute" />
      <Container className="container--hero text-center">
        <h2 className="welcomeHero__title mb-scale-2">
          Welcome to MedicareCENTER
        </h2>
        <p className="welcomeHero__content mb-scale-2">
          A powerful new platform with all you need to increase production this
          upcoming AEP – enrollment tools, CRM, Learning Center and more!
        </p>

        {getHeroCTA()}
      </Container>
    </div>
  );
};

export default WelcomeHero;
