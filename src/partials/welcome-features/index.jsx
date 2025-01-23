import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

import ImageFeatureCRM from "images/welcome-features/feature-client-management.png";
import ImageFeatureCSG from "images/welcome-features/feature-csg.png";
import ImageFeatureQAE from "images/welcome-features/feature-quote-and-enrollment.png";
import ImageFeatureSSO from "images/welcome-features/feature-sso.png";

import Container from "components/ui/container";

import "./index.scss";

const Section = ({ className = "", rightCol, leftCol }) => (
    <div className={`section-flex ${className}`}>
        <div className="column left-col">{leftCol}</div>
        <div className="column right-col">{rightCol}</div>
    </div>
);

const SectionText = ({ title, description }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleEnter = () => {
        setIsVisible(true);
    };

    return (
        <>
            <Waypoint onEnter={handleEnter} />
            <div className={`welcome-features__feature-content ${isVisible ? "slidein" : ""}`}>
                <h3 className="hdg--2 text-thin mb-2">{title}</h3>

                <p className="text-left section-text">{description}</p>
            </div>
        </>
    );
};
const SectionImage = ({ imgSrc }) => (
    <div className="welcome-features__feature-image">
        <img src={imgSrc} alt="" loading="lazy" />
    </div>
);

const WelcomeFeatures = () => {
    return (
        <Container className="mt-30 welcome-features mt-scale-3 mb-scale-3">
            <Section
                className="reverse"
                leftCol={<SectionImage imgSrc={ImageFeatureCSG} />}
                rightCol={
                    <SectionText
                        title="CSG + Integrity"
                        description="Access powerful quoting and research features with the full CSG 
            suite of solutions available within Integrity."
                    />
                }
            />
            <Section
                leftCol={
                    <SectionText
                        title="Expanded Client Management"
                        description="Now it’s easier than ever to keep track of your clients’ 
            needs and history. Create better engagement, 
            stronger relationships, and greater business with the 
            improved CRM features. "
                    />
                }
                rightCol={<SectionImage imgSrc={ImageFeatureCRM} />}
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
                        title="Integrated Quoting and Enrollment"
                        description="Save time every step of the way by jumping 
            straight from a client activity log or provider 
            preference into a quote or SOA."
                    />
                }
                rightCol={<SectionImage imgSrc={ImageFeatureQAE} />}
            />
        </Container>
    );
};

export default WelcomeFeatures;
