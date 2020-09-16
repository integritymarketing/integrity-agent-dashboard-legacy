import React from "react";
import Container from "components/ui/container";
import ImageFeatureCMS from "images/welcome-features/feature-cms.png";
import ImageFeatureSMS from "images/welcome-features/feature-sms.png";
import ImageFeatureSSO from "images/welcome-features/feature-sso.png";
import ImageFeatureTools from "images/welcome-features/feature-tools.png";

import "./index.scss";

const data = [
  {
    image: ImageFeatureCMS,
    title: "Client Management, Simplified",
    copy: `No matter what quoting or enrollment tool you use, MedicareCENTER now 
    lets you note where clients are in the application process or manage your follow-ups 24/7.`,
    additionalClasses: ["first"],
  },
  {
    image: ImageFeatureSMS,
    title: "Text Your Clients",
    copy: `Compliantly text clients from start to finish! Sales should always 
    be this easy and straightforward. Text scope of appointments, text to review and sign — all with less stress about staying compliant.`,
    additionalClasses: ["reverse", "force-narrow"],
  },
  {
    image: ImageFeatureSSO,
    title: "All-in-one Universal Login",
    copy: `Say goodbye to separate logins. We bring all of your carriers to one place with scope of appointments, quoting, Rx drug lists, e-applications and more. One username, one password, one goal — keep it simple.`,
    additionalClasses: [],
  },
  {
    image: ImageFeatureTools,
    title: "The Best Tools at Your Fingertips",
    copy: `Why spend time searching the web for enrollment and quoting tools? MedicareCENTER brings MedicareAPP, MedicareLINK and Medicare Supplement quoting to your laptop, tablet or smartphone. Which makes it easy to access anytime, anywhere.`,
    additionalClasses: ["reverse"],
  },
];

const Section = ({ image, alt, title, copy, additionalClasses }) => {
  const moreClasses = additionalClasses
    .map((c) => `welcome-features__feature--${c}`)
    .join(" ");
  return (
    <section
      className={`mb-5 text-center welcome-features__feature ${moreClasses}`}
    >
      <div className="welcome-features__feature__image">
        <img src={image} alt={alt || title} />
      </div>
      <div className="welcome-features__feature__content">
        <h4 className="hdg--2 text-thin mb-2">{title}</h4>
        <p className="text-left">{copy}</p>
      </div>
    </section>
  );
};

const WelcomeFeatures = () => {
  const sections = data.map((section, i) => (
    <Section
      key={section.title}
      image={section.image}
      title={section.title}
      copy={section.copy}
      additionalClasses={section.additionalClasses}
    />
  ));

  return (
    <Container className="welcome-features mt-scale-3 mb-scale-3">
      {sections}
    </Container>
  );
};

export default WelcomeFeatures;
