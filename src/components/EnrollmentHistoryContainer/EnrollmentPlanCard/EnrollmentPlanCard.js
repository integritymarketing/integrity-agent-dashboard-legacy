import React from "react";
import { useHistory } from "react-router";
import styles from "./EnrollmentPlanCard.module.scss";
import IconWithText from "packages/IconWithText";
import View from "./View.png";
import Link from "./Link.png";
import Media from "react-media";
import Icon from "components/Icon";
import { formatDate } from "utils/dates";
import { Button } from "components/ui/Button";

export default function EnrollmentPlanCard(props) {
  const {
    submittedDate,
    enrolledDate,
    effectiveDate,
    policyHolder,
    policyId,
    currentYear = true,
    leadId,
    isEnrollPlansPage,
    onShareClick,
  } = props;

  const history = useHistory();

  const navigateEnrollDetails = () => {
    history.push(
      `/${leadId}/enroll/KT67CY2KMJ/${formatDate(effectiveDate, "yyyy-MM-01")}`
    );
  };
  return (
    <div className={styles.planCardContainer}>
      <div className={styles.planHistory}>
        {currentYear ? "Current Plan" : "Previous Years"}
      </div>
      <div
        className={`${styles.planCard} ${
          !currentYear ? styles.isBordered : ""
        }`}
      >
        {/* <div className={`${styles[status]} ${styles.status}`}>
          <strong>Status:</strong> {status}
        </div> */}
        <div
          className={`${!currentYear ? styles.previousYear : ""} ${
            styles.planDetails
          }`}
        >
          <div className={styles.detailAndDateContainer}>
            <div className={styles.details}>
              <div className={styles.planName}>
                Humana Gold Plus H5619-021 (HMO)
              </div>
              <div className={styles.planCompany}>Humana Advantage</div>
              <div>
                <strong className={styles.planId}>Plan ID:</strong>{" "}
                <span>548512365</span>
              </div>
            </div>
            <div className={styles.dates}>
              <PlanDate type="Submitted" date={submittedDate} />
              <PlanDate type="Enrolled" date={enrolledDate} />
              <PlanDate type="Effective" date={effectiveDate} />
            </div>
          </div>

          {isEnrollPlansPage ? (
            <div>
              {" "}
              <Button
                label="Share Plan"
                onClick={() => onShareClick()}
                type="secondary"
                className={styles.shareBtn}
              />{" "}
            </div>
          ) : (
            <div className={styles.links}>
              <Media
                queries={{
                  small: "(max-width: 767px)",
                }}
              >
                {(matches) =>
                  matches.small ? (
                    <>
                      <div onClick={navigateEnrollDetails}>
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
                      </div>
                      <div>
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
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={navigateEnrollDetails}>
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
                      </div>
                      <div onClick={navigateEnrollDetails}>
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
                      </div>
                    </>
                  )
                }
              </Media>
            </div>
          )}
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
