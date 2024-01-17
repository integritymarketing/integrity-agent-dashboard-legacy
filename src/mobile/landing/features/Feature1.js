import React from "react";

import Styles from "../LandingPage.module.scss";

const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.medicarecenter";
const APP_STORE = "https://apps.apple.com/us/app/medicarecenter/id1623328763";

export default function Feature1() {
    return (
        <div className={Styles.featureContainer}>
            <img src="/images/landingPage/serveClient.png" alt="" className={Styles.featureHeroImage} />
            <p className={Styles.clientServeHeading}>Serve Clients Better</p>
            <p className={Styles.clientServeBody}>
                With Contact Management in our user-friendly CRM, you can spend less time managing your clients and more
                time serving them, all while staying 100% compliant.
            </p>
            {/* Feature Box*/}
            <div className={Styles.featureBox}>
                {/* Image */}
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Call-Recording.svg" alt="" className={Styles.featureImg} />
                </div>
                {/* Content */}
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Call Recording</p>
                    <p className={Styles.featureText}>
                        Simplify how you maintain compliance – this crucial feature allows you to record, download and
                        store both inbound and outbound sales calls as required by CMS regulations.
                    </p>
                </div>
            </div>
            {/* Feature Box*/}
            <div className={Styles.featureBox}>
                {/* Image */}
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Reporting.svg" alt="" className={Styles.featureImg} />
                </div>
                {/* Content */}
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Dashboard and Reporting</p>
                    <p className={Styles.featureText}>
                        Understand and meet needs faster with at-a-glance client tracking.
                    </p>
                </div>
            </div>
            {/* Feature Box*/}
            <div className={Styles.featureBox}>
                {/* Image */}
                <div className={Styles.featureImgContainer}>
                    <img src="/images/landingPage/Group 3412.svg" alt="" className={Styles.featureImg} />
                </div>
                {/* Content */}
                <div className={Styles.featureContent}>
                    <p className={Styles.featureHeading}>Mobile App</p>
                    <p className={Styles.featureText}>
                        Work when you want, from where you want. Get mobile-exclusive push notifications, plus all the
                        features of Integrity. Download today!
                    </p>
                    <div className={Styles.getButtons}>
                        <a href={GOOGLE_PLAY} target="_blank" rel="noopener noreferrer">
                            <img src="/images/landingPage/badge-Google.svg" alt="" width="120px" height="40px" />
                        </a>
                        <a href={APP_STORE} target="_blank" rel="noopener noreferrer">
                            <img src="/images/landingPage/badge-Apple.svg" alt="" width="120px" height="40px" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
