import React from "react";
import { ActionButton } from "@integritymarketing/ui-button-components";
import { useAuth0 } from "@auth0/auth0-react";
import SimpleFooter from "partials/simple-footer";
import Feature1 from "./features/Feature1";
import Feature2 from "./features/Feature2";
import Feature3 from "./features/Feature3";
import Feature4 from "./features/Feature4";
import GetStarted from "./getStarted/GetStarted";
import Styles from "./LandingPage.module.scss";
import Testimonial from "./testimonial/Testimonial";
import useFlashMessage from "hooks/useFlashMessage";
import * as Sentry from "@sentry/react";
import VideoPlayer from "components/VideoPlayer";

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();
  const { show: showMessage } = useFlashMessage();

  async function handleLogin() {
    try {
      await loginWithRedirect({
        redirectUri: window.location.origin + "/dashboard",
      });
    } catch (e) {
      Sentry.captureException(e);
      console.error("sign in error: ", e);
      showMessage("Unable to sign in at this time.", { type: "error" });
    }
  }

  return (
    <>
      {/* Header */}
      <div className={Styles.header}>
        <img
          src="/images/landingPage/MedicareCENTER-Logo.svg"
          alt=""
          className={Styles.headerLogo}
        />
        <ActionButton
          className={Styles.loginButton}
          text="Login"
          onClick={handleLogin}
        />
      </div>
      {/* Hero */}
      <div className={Styles.hero}>
        <img
          src="/images/landingPage/Hero.png"
          alt="Hero"
          className={Styles.heroImage}
        />
        <p className={Styles.heading}>
          Helping agents reach their full potential
        </p>
        <span className={Styles.bodyText}>
          Say hello to a powerful, easy-to-use system built to help you serve
          clients better, boost your production and take control of your
          business.
        </span>
        <div className={Styles.getStarted}>
          <ActionButton
            text="Get Started"
            onClick={() => {
              window.open(
                `${process.env.REACT_APP_AUTH_REGISTRATION_URL}`
              );
            }}
          />
        </div>
      </div>
      {/* Call Recording */}
      <div className={Styles.mt132} />
      <p className={Styles.heading}>Call Recording Solutions for you!</p>
      <p className={Styles.bodyText}>
        Compliance at the press of a button — here to help you before AEP!
      </p>
      <VideoPlayer
        className={Styles.videoPlayer}
        url={"https://player.vimeo.com/video/744367402?h=f0b1aad7a2"}
      />
      {/* Feature 1 */}
      <Feature1 />
      {/* Feature 2 */}
      <Feature2 />
      {/* Feature 3 */}
      <Feature3 />
      {/* Testimonial */}
      <Testimonial />
      {/* Feature 4 */}
      <Feature4 />
      {/* Get Started */}
      <GetStarted />
      {/* Footer */}
      <SimpleFooter />
    </>
  );
};

export default LandingPage;
