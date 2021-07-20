import React from "react";
import Container from "components/ui/container";
import ImageFeatureCMS from "images/welcome-features/feature-cms.png";
import ImageFeatureSMS from "images/welcome-features/feature-sms.png";
import ImageFeatureSSO from "images/welcome-features/feature-sso.png";
import ImageFeatureTools from "images/welcome-features/feature-tools.png";

import "./index.scss";

const WelcomeFeatures = () => {
  const Section = ({ className = "", rightCol, leftCol }) => (
    <div className={`section-flex ${className}`}>
      <div className="column left-col">{leftCol}</div>
      <div className="column right-col">{rightCol}</div>
    </div>
  );

  const SectionText = ({ title, description }) => (
    <div className={`welcome-features__feature-conten`}>
      <h3 className="hdg--2 text-thin mb-2">{title}</h3>

      <p className="text-left section-text">{description}</p>
    </div>
  );

  const SectionImage = ({ imgSrc }) => (
    <div className="welcome-features__feature-image">
      <img src={imgSrc} alt="" loading="lazy" />
    </div>
  );

  return (
    <Container className="mt-30 welcome-features mt-scale-3 mb-scale-3">
      <Section
        className="reverse"
        leftCol={<SectionImage imgSrc={ImageFeatureCMS} />}
        rightCol={
          <SectionText
            title="Client Management, Simplified"
            description="No matter what quoting or enrollment tool you use, MedicareCENTER
            now lets you note where clients are in the application process or
            manage your follow-ups 24/7."
          />
        }
      />
      <Section
        leftCol={
          <SectionText
            title="Text Your Clients"
            description="Compliantly text clients from start to finish! Sales should always
              be this easy and straightforward. Text scope of appointments, text
              to review and sign — all with less stress about staying compliant."
          />
        }
        rightCol={<SectionImage imgSrc={ImageFeatureSMS} />}
      />
      <Section
        className="reverse"
        leftCol={<SectionImage imgSrc={ImageFeatureSSO} />}
        rightCol={
          <SectionText
            title="All-in-one Universal Login"
            description="Say goodbye to separate logins. We bring all of your carriers to one place with scope of appointments, quoting, Rx drug lists, e-applications and more. One username, one password, one goal — keep it simple."
          />
        }
      />
      <Section
        leftCol={
          <SectionText
            title="The Best Tools at Your Fingertips"
            description="Why spend time searching the web for enrollment and quoting tools? MedicareCENTER brings MedicareAPP, MedicareLINK and Medicare Supplement quoting to your laptop, tablet or smartphone. Which makes it easy to access anytime, anywhere."
          />
        }
        rightCol={<SectionImage imgSrc={ImageFeatureTools} />}
      />
    </Container>
  );
};

export default WelcomeFeatures;
