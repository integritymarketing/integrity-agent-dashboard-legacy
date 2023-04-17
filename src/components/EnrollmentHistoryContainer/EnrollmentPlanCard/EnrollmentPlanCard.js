import React from "react";
import styles from "./EnrollmentPlanCard.module.scss";
import IconWithText from "packages/IconWithText";
import View from "./View.png";
import Link from "./Link.png";
import Media from "react-media";
import Icon from "components/Icon";

export default function EnrollmentPlanCard(props) {
  const {
    submittedDate,
    enrolledDate,
    effectiveDate,
    policyHolder,
    policyId,
    currentYear = true,
  } = props;
  return (
    <div className={styles.planCardContainer}>
      <div className={styles.planHistory}>
        {currentYear ? "Current Plan" : "Previous Years"}
      </div>
      <div className={styles.planCard}>
        {/* <div className={`${styles[status]} ${styles.status}`}>
          <strong>Status:</strong> {status}
        </div> */}
        <div
          className={`${!currentYear ? styles.previousYear : ""} ${
            styles.planDetails
          }`}
        >
          <div className={styles.details}>
            <div className={styles.planName}>
              Humana Gold Plus H5619-021 (HMO)
            </div>
            <div className={styles.planCompany}>Humana Advantage</div>
            <div>
              <strong classname={styles.planId}>Plan ID:</strong>{" "}
              <span>548512365</span>
            </div>
          </div>
          <div className={styles.dates}>
            <PlanDate type="Submitted" date={submittedDate} />
            <PlanDate type="Enrolled" date={enrolledDate} />
            <PlanDate type="Effective" date={effectiveDate} />
          </div>

          <div className={styles.links}>
            <Media
              queries={{
                small: "(max-width: 767px)",
              }}
            >
              {(matches) =>
                matches.small ? (
                  <>
                    <IconWithText
                      text="View"
                      icon={
                        <Icon
                          altText="View"
                          className={styles.iconPng}
                          image={View}
                        />
                      }
                      screensize="small"
                    />
                    <IconWithText
                      text="Relink"
                      icon={
                        <Icon
                          altText="Link"
                          className={styles.iconPng}
                          image={Link}
                        />
                      }
                      screensize="small"
                    />
                  </>
                ) : (
                  <>
                    <IconWithText
                      text="View"
                      icon={
                        <Icon
                          altText="View"
                          className={styles.iconPng}
                          image={View}
                        />
                      }
                    />
                    <IconWithText
                      text="Relink"
                      icon={
                        <Icon
                          altText="Link"
                          className={styles.iconPng}
                          image={Link}
                        />
                      }
                    />
                  </>
                )
              }
            </Media>
          </div>
        </div>
      </div>
      <div
        className={`${!currentYear ? styles.previousYear : ""} ${
          styles.policyDetails
        }`}
      >
        <div className={styles.policyHolder}>
          {renderPlanDetails("Policy Holder", policyHolder)}
        </div>
        <div className={styles.policyId}>
          {renderPlanDetails("Policy ID", policyId)}
        </div>
      </div>
    </div>
  );

  function PlanDate({ type, date }) {
    if (date) {
      return (
        <div className={styles.date}>
          <strong>{type}: </strong>
          <span>{date}</span>
        </div>
      );
    }
    return null;
  }

  function renderPlanDetails(label, value) {
    return (
      <>
        <strong className={styles.label}>{label}: </strong>
        <span className={styles.value}>{value}</span>
      </>
    );
  }
}
