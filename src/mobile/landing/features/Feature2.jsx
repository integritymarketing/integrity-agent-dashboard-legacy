import React from "react";

import Styles from "../LandingPage.module.scss";

export default function Feature2() {
    return (
        <div className={Styles.featureContainer}>
            <img src="/images/landingPage/Mask Group 1.png" alt="" className={Styles.featureHeroImg} />
            <p className={Styles.clientServeHeading}>Boost Your Production</p>
            <p className={Styles.clientServeBody}>
                Integrity empowers you to work smarter and more efficiently. All to help you take your business to a
                whole new level.
            </p>
            <div className={Styles.featureBox}>
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Leads.svg" alt="" className={Styles.featureImg} />
                </div>
                {/* Content */}
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Lead Management</p>
                    <p className={Styles.featureText}>
                        Choose when to have leads delivered right to your Contact Management profile.
                    </p>
                </div>
            </div>
            <div className={Styles.featureBox}>
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Share.svg" alt="" className={Styles.featureImg} />
                </div>
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Side-by-Side Plan Comparison</p>
                    <p className={Styles.featureText}>Quickly guide clients to the best available coverage options.</p>
                </div>
            </div>
            <div className={Styles.featureBox}>
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Quote-1.svg" alt="" className={Styles.featureImg} />
                </div>
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Integrated Quoting & Enrollment</p>
                    <p className={Styles.featureText}>
                        Connect to the largest selection of MA and PDP plans straight from a client record in our CRM
                        for easy e-apps.
                    </p>
                </div>
            </div>
        </div>
    );
}
