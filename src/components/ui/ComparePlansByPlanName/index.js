import React, { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import clientsService from "services/clientsService";
import plansService from "services/plansService";
import { Button } from "components/ui/Button";
import EnrollmentModal from "../Enrollment/enrollment-modal";
import useRoles, { Roles } from "hooks/useRoles";
import styles from "../../../pages/PlansPage.module.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const LOGO_BASE_URL =
  "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

export default function ComparePlansByPlanName({
  agentInfo = {},
  comparePlans,
  setComparePlanModalOpen,
  handleRemovePlan,
  id,
  plansLoading,
  isEmail = false,
  isModal = false,
  contactData,
}) {
  const addToast = useToast();
  const [userData, setUserData] = useState(contactData);
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState();

  const { hasRole } = useRoles();
  const nonRTS_USER = hasRole(Roles.NonRts);

  useEffect(() => {
    if (!userData && id) {
      const getContactInfo = async () => {
        const contactDataResponse = await clientsService.getContactInfo(id);
        setUserData(contactDataResponse);
      };
      getContactInfo();
    }
  }, [id, userData]);

  const handleOnClick = (plan) => {
    setEnrollingPlan(plan);
    setModalOpen(true);
  };

  const handleBenificiaryClick = useCallback(async (plan) => {
    try {
      const enrolled = await plansService.enrollConsumerView(
        id,
        plan.id,
        {
          enrollRequest: {
            firstName: agentInfo?.LeadFirstName,
            lastName: agentInfo?.LeadLastName,
            zip: agentInfo?.ZipCode,
            countyFIPS: agentInfo?.CountyFIPS,
            phoneNumber: agentInfo?.AgentPhoneNumber,
            email: agentInfo?.AgentEmail,
            sendToBeneficiary: true,
            middleInitial:
              agentInfo?.MiddleInitial === "" ? null : agentInfo.MiddleInitial,
            dateOfBirth: agentInfo?.DateOfBirth,
            state: agentInfo?.State,
          },
        },
        agentInfo.AgentNpn
      );

      if (enrolled && enrolled.url) {
        window.open(enrolled.url, "_blank").focus();
        addToast({
          type: "success",
          message: "Successfully Sent to Client",
        });
      } else {
        addToast({
          type: "error",
          message: "There was an error enrolling the contact.",
        });
      }
    } catch (error) {
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "There was an error enrolling the contact.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${styles["plan-comparsion-heder"]} ${
        plansLoading && styles["display-initial"]
      } container ${isModal && styles["in-modal"]}`}
    >
      {comparePlans.length > 0 && (
        <>
          {!isModal && !isEmail && (
            <div className={`${styles["compare-div"]}`}>
              <div className={`${styles["vertical-stack"]}`}>
                <div className={`${styles["compare-text"]}`}>Compare Plans</div>
                <div className={`${styles["spacer"]}`}></div>
                <>
                  <div className={`${styles["share-plan-text"]}`}>
                    Share plans with client
                  </div>
                  <Button
                    onClick={() => setComparePlanModalOpen(true)}
                    label="Share"
                    type="secondary"
                  ></Button>
                </>
              </div>
              <span className={`${styles["plan-separator"]}`}></span>
            </div>
          )}
          {isEmail && (
            <div className={`${styles["compare-div"]}`}>
              <div className={`${styles["compare-text"]}`}>Compare Plans</div>
              <div className={`${styles["spacer"]}`}></div>
            </div>
          )}
          {comparePlans?.map((plan, idx) => (
            <div key={idx} className={`${styles["plan-div"]}`}>
              <div
                className={`${styles["comp-mr-left"]} ${styles["compr-plan-col-hdr"]}`}
              >
                <div>
                  {" "}
                  <img
                    src={LOGO_BASE_URL + plan.logoURL}
                    alt="logo"
                    className={styles["plan-img"]}
                  />
                </div>
                <div className={styles["comp-plan-name"]}>
                  {plan && plan.planName}
                </div>
                <div className={styles["comp-plan-amnt"]}>
                  <span className={styles["value"]}>
                    {currencyFormatter.format(plan.annualPlanPremium / 12)}
                    <span className={styles["per"]}> / month</span>
                  </span>
                </div>
                {!plan.nonLicensedPlan &&
                  !isModal &&
                  !isEmail &&
                  !nonRTS_USER &&
                  process.env.REACT_APP_NON_RTS_FLAG !==
                    "hide"(
                      <Button
                        onClick={() => handleOnClick(plan)}
                        label={"Enroll"}
                        type="primary"
                      />
                    )}
                {!plan.nonLicensedPlan &&
                  !isModal &&
                  isEmail &&
                  !nonRTS_USER &&
                  process.env.REACT_APP_NON_RTS_FLAG !==
                    "hide"(
                      <Button
                        onClick={() => handleBenificiaryClick(plan)}
                        label={"Enroll"}
                        type="primary"
                      />
                    )}
                {!isModal && !isEmail && comparePlans.length > 1 && (
                  <span
                    className={styles.close}
                    onClick={() => handleRemovePlan(plan.id)}
                  >
                    X
                  </span>
                )}
              </div>
              <div className={`${styles["plan-seperator"]}`}></div>
            </div>
          ))}
          {!isEmail && comparePlans.length < 3 && (
            <div className={`${styles["plan-div"]}`}>
              <span className={styles["retrun-txt"]}>
                <a href={`/plans/${id}?preserveSelected=true`}>
                  Return to plans list to add{" "}
                  {comparePlans.length === 1 ? "2nd" : "3rd"} plan for
                  Comparison.
                </a>
              </span>
            </div>
          )}
        </>
      )}
      <EnrollmentModal
        modalOpen={modalOpen}
        planData={enrollingPlan}
        contact={userData}
        handleCloseModal={() => setModalOpen(false)}
      />
    </div>
  );
}
