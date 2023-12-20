import React from "react";
import Styles from "../LandingPage.module.scss";

export default function Feature3() {
  return (
    <div className={Styles.featureContainer}>
      <img src="/images/landingPage/business.png" alt="" className={Styles.featureHeroImg} />
      <p className={Styles.clientServeHeading}>Take Control of Your Business</p>
      <p className={Styles.clientServeBody}>
        Integrity Client's all-in-one platform puts you in command of your most important tasks, while providing
        key insights. How’s that for intelligent?
      </p>
      {/* Feature Box*/}
      <div className={Styles.featureBox}>
        {/* Image */}
        <div className={Styles.featureImgContainer}>
          <img src="/images/landingPage/Login.svg" alt="" className={Styles.featureImg} />
        </div>
        {/* Content */}
        <div className={Styles.featureContent}>
          <p className={Styles.featureHeading}>Universal Login</p>
          <p className={Styles.featureText}>
            Access MedicareAPP, MedicareLINK, CSG APP and Integrity’s our CRM and Quoting and E-App system –
            Contact Management - with one username and password.
          </p>
        </div>
      </div>
      {/* Feature Box*/}
      <div className={Styles.featureBox}>
        {/* Image */}
        <div className={Styles.featureImgContainer}>
          <img src="/images/landingPage/Interface.svg" alt="" className={Styles.featureImg} />
        </div>
        {/* Content */}
        <div className={Styles.featureContent}>
          <p className={Styles.featureHeading}>Easy-to-Use Interface</p>
          <p className={Styles.featureText}>
            Master comprehensive functions without a long learning curve. Take advantage of exclusive tips,
            guides, training, and resources in our LearningCENTER.
          </p>
        </div>
      </div>
      {/* Feature Box*/}
      <div className={Styles.featureBox}>
        {/* Image */}
        <div className={Styles.featureImgContainer}>
          <img src="/images/landingPage/insights.svg" alt="" className={Styles.featureImg} />
        </div>
        {/* Content */}
        <div className={Styles.featureContent}>
          <p className={Styles.featureHeading}>Insights from CSG</p>
          <p className={Styles.featureText}>
            Get valuable info and industry trends to help give you an edge.
          </p>
        </div>
      </div>
    </div>
  );
}
