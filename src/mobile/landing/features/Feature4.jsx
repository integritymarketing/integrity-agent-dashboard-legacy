import React from "react";
import Styles from "./Feature4.module.scss";

export default function Feature4() {
  return (
    <div className={Styles.container}>
      <p className={Styles.heading}>Smart and Secure</p>
      <p className={Styles.subHeading}>
        Built to give you peace of mind, Integrity Client's state-of-the art tech
        helps keep you and your data safe and compliant — just the way you like
        it.
      </p>
      {/* 1st */}
      <div className={Styles.imgContainer}>
        <img
          src="/images/landingPage/Cloud.svg"
          alt=""
          className={Styles.image}
        />
      </div>
      <p className={Styles.heading}>Cloud Convenience</p>
      <p className={Styles.text}>
        Works with smartphones, tablets, desktops and laptops.
      </p>
      {/* 2nd */}
      <div className={Styles.imgContainer}>
        <img
          src="/images/landingPage/Security.svg"
          alt=""
          className={Styles.image}
        />
      </div>

      <p className={Styles.heading}>Robust Data Security</p>
      <p className={Styles.text}>
        Protects your information and ensures it stays with you.
      </p>
      {/* 3rd */}
      <div className={Styles.imgContainer}>
        <img
          src="/images/landingPage/Compliance.svg"
          alt=""
          className={Styles.image}
        />
      </div>
      <p className={Styles.heading}>Built-in Compliance</p>
      <p className={Styles.text}>
        Follows all CMS guidelines, including for SOA tracking and call
        recording.
      </p>
    </div>
  );
}
