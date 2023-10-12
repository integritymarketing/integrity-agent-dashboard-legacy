import React, { useEffect } from "react";
import WelcomeHero from "partials/welcome-hero";
import WelcomeFeatures from "partials/welcome-features";
import SimpleFooter from "partials/simple-footer";

const WelcomePage = () => {
  return (
    <React.Fragment>
      <WelcomeHero />
      <WelcomeFeatures />
      <div className="bg-high-contrast">
        <SimpleFooter className="simple-footer--no-padding simple-footer--blue-bg" />
      </div>
    </React.Fragment>
  );
};

export default WelcomePage;
