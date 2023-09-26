import React, { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import clientsService from "services/clientsService";
import enrollPlansService from "services/enrollPlansService";
import Button from "@mui/material/Button";
import EnrollmentModal from "../Enrollment/enrollment-modal";
import useRoles from "hooks/useRoles";
import { useParams } from "react-router-dom";
import PreEnrollPDFModal from "components/SharedModals/PreEnrollPdf";
import Container from "components/ui/container";
import Share from "components/icons/share2";
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
  const { effectiveDate } = useParams();
  const [userData, setUserData] = useState(contactData);
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState();
  const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
  const { isNonRTS_User } = useRoles();

  const isEmailNonRts = isEmail
    ? agentInfo?.Roles?.includes("nonRts")
    : isNonRTS_User;

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
      const enrolled = await enrollPlansService.enrollConsumer(
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
            effectiveDate: effectiveDate,
          },
          planDetail: plan,
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
    <Container>
      <div
        className={`${styles["plan-comparison-header"]} ${
          plansLoading && styles["display-initial"]
        } container ${isModal && styles["in-modal"]}`}
      >
        {comparePlans.length > 0 && (
          <>
            {!isModal && !isEmail && (
              <div className={`${styles["compare-div"]}`}>
                <div className={`${styles["vertical-stack"]}`}>
                  <div className={`${styles["compare-text"]}`}>
                    Compare Plans
                  </div>
                  <div className={`${styles["spacer"]}`}></div>
                  <>
                    <div className={`${styles["share-plan-text"]}`}>
                      Share plans with client
                    </div>
                    <Button
                      endIcon={<Share />}
                      onClick={() => setComparePlanModalOpen(true)}
                    >
                      Share
                    </Button>
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
                    !isEmailNonRts && (
                      <>
                        <Button
                          onClick={() => setPreCheckListPdfModal(true)}
                          label={"Enroll"}
                          type="primary"
                        />
                        {preCheckListPdfModal && (
                          <PreEnrollPDFModal
                            open={preCheckListPdfModal}
                            onClose={() => {
                              setPreCheckListPdfModal(false);
                              handleOnClick(plan);
                            }}
                          />
                        )}
                      </>
                    )}
                  {!plan.nonLicensedPlan &&
                    !isModal &&
                    isEmail &&
                    !isEmailNonRts && (
                      <>
                        <Button
                          onClick={() => setPreCheckListPdfModal(true)}
                          label={"Enroll"}
                          type="primary"
                        />
                        {preCheckListPdfModal && (
                          <PreEnrollPDFModal
                            open={preCheckListPdfModal}
                            onClose={() => {
                              setPreCheckListPdfModal(false);
                              handleBenificiaryClick(plan);
                            }}
                          />
                        )}
                      </>
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
          effectiveDate={effectiveDate}
        />
      </div>
    </Container>
  );
}
