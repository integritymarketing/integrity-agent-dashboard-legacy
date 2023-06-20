import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "hooks/useFetch";
import styles from "./EnrollmentHistoryPage.module.scss";
import WithLoader from "components/ui/WithLoader";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import MapdContent from "partials/plan-details-content/mapd";
import MaContent from "partials/plan-details-content/ma";
import PdpContent from "partials/plan-details-content/pdp";
import { PLAN_TYPE_ENUMS } from "../constants";
import SharePlanModal from "components/ui/SharePlan/sharePlan-modal";
import { BackToTop } from "components/ui/BackToTop";
import ContactFooter from "partials/global-footer";
import GoBackNavbar from "components/BackButtonNavbar";
import Media from "react-media";

const enrollData = {
  agentNpn: "17138811",
  leadId: "2288457",
  policyNumber: "522914424",
  plan: "1jzrm179w3",
  carrier: null,
  policyStatus: "submitted",
  consumerSource: "Medicare Center",
  confirmationNumber: "dVzSPUzwJV",
  consumerFirstName: "arsenio",
  consumeLastName: "assin",
  policyEffectiveDate: "2019-03-18T00:00:00",
  appSubmitDate: "2023-04-18T00:00:00",
  hasPlanDetails: false,
};

const plan = {
  enrollmentId: "12345",
  agentNpn: "12345",
  leadId: "12345",
  year: 0,
  enrolledSource: "12345",
  enrollType: "12345",
  createdDate: "2023-05-09T10:41:53.635Z",
  modifiedDate: "2023-05-09T10:41:53.635Z",
  medicareEnrollment: {
    enrollmentId: "12345",
    planId: "12345",
    sessionId: "12345",
    confirmationNumber: "12345",
    planDetails: {
      segmentID: "12345",
      planID: "12345",
      carrierName: "ABCD",
      marketingName: "ABCD",
      id: "12345",
      planName: "12345",
      contractID: "12345",
      planSubType: "12345",
      planType: 2,
      planRating: 0,
      initialCoverageLimit: 0,
      annualPlanPremium: 0,
      medicalPremium: 0,
      estimatedAnnualDrugCost: 0,
      estimatedAnnualMedicalCost: 0,
      medicalDeductible: 0,
      maximumOutOfPocketCost: 0,
      outOfNetworkMaximumOutOfPocketCost: 0,
      isPlanNetworkAvailable: true,
      providers: [
        {
          firstName: "Zimmerman",
          lastName: "Robert",
          degree: "dr",
          specialty: "string",
          gender: "male",
          middleName: "H",
          suffix: "string",
          title: "string",
          npi: "888001",
          isPrimary: true,
          addressId: "12345",
          inNetwork: true,
          address: {
            city: "AAA",
            state: "AAA",
            streetLine1: "AAA",
            zipCode: "AAA",
            phoneNumbers: ["1234567898"],
          },
        },
      ],
      pharmacyCosts: [
        {
          pharmacyType: 0,
          specifiedPharmacy: true,
          pharmacyID: "string",
          isMailOrder: true,
          name: "string",
          address1: "string",
          address2: "string",
          city: "string",
          zip: "string",
          state: "string",
          pharmacyPhone: "string",
          isPreferred: true,
          monthlyCosts: [
            {
              monthID: 0,
              totalMonthlyCost: 0,
              costPhases: "string",
              costDetail: [
                {
                  fullCost: 0,
                  memberCost: 0,
                  phase: "string",
                  labelName: "string",
                },
              ],
            },
          ],
          drugCosts: [
            {
              labelName: "string",
              quantity: 0,
              fullCost: 0,
              deductible: 0,
              beforeGap: 0,
              gap: 0,
              afterGap: 0,
              drugFootnotes: [
                {
                  number: 0,
                  letter: "string",
                  description: "string",
                },
              ],
            },
          ],
          isNetwork: true,
          hasCeilingPrice: true,
        },
      ],
      planDataFields: [
        {
          name: "string",
          description: "string",
          type: "string",
          range: [
            {
              rangeMax: 0,
              rangeMin: 0,
              amount: 0,
              amountType: 0,
            },
          ],
        },
      ],
      documents: [
        {
          name: "string",
          url: "string",
          linkName: "string",
          types: [
            {
              name: "string",
            },
          ],
        },
      ],
      planDrugCoverage: [
        {
          tierNumber: 0,
          hasQuantityLimit: true,
          hasStepTherapy: true,
          hasPriorAuthorization: true,
          labelName: "string",
          ndc: "string",
          limitedAccess: true,
        },
      ],
      formularyTiers: [
        {
          tierDescription: "string",
          tierNumber: 0,
          formularyID: 0,
          coveredDosages: 0,
          isExceptionTier: true,
          copayPrices: [
            {
              cost: 0,
              costType: 0,
              isMailOrder: true,
              isPreferredPharmacy: true,
              daysOfSupply: 0,
              defaultBenefit: true,
            },
          ],
        },
      ],
      effectiveEndDate: "2023-05-09T10:41:53.635Z",
      effectiveStartDate: "2023-05-09T10:41:53.635Z",
      nonLicensedPlan: true,
      logoURL: "string",
      drugDeductible: 0,
      estimatedAnnualDrugCostPartialYear: 0,
      hasMailDrugBenefits: true,
      hasPreferredMailPharmacyNetwork: true,
      hasPreferredPharmacyNetwork: true,
      hasPreferredRetailPharmacyNetwork: true,
      modelDrugProgram: true,
      isHSAQualifiedPlan: true,
      crossUpSellPlanOptions: {
        plan_Year_ID: "string",
        plan_Year: "string",
        combo_DVH: "string",
        dental: "string",
        vision: "string",
        hearing: "string",
        hospital_Indemnity: "string",
        short_Term_Recovery: "string",
        cancer: "string",
      },
    },
  },
};

const API_URL = (confirmationNumber) =>
  `https://ae-api-dev.integritymarketinggroup.com/ae-enrollment-service/api/v1.0/Medicare/confirmationNumber/${confirmationNumber}`;

const EnrollmentHistoryPage = () => {
  const { contactId, confirmationNumber } = useParams();
  const { data, loading, error } = useFetch(API_URL(confirmationNumber));
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  console.log("JJJ", contactId, data, error, confirmationNumber);
  let plan_data = plan?.medicareEnrollment?.planDetails;

  return (
    <>
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <div className={styles.enrollmentHistory}>
        <SharePlanModal
          modalOpen={shareModalOpen}
          planData={plan_data}
          handleCloseModal={() => setShareModalOpen(false)}
        />
        <WithLoader isLoading={loading}>
          <Helmet>
            <title>MedicareCENTER - Enrollment History</title>
          </Helmet>
          <GlobalNav />
          <GoBackNavbar />
          <Container className={styles.body}>
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "MAPD" && (
              <MapdContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
                pharmacies={plan_data?.pharmacyCosts}
              />
            )}
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "PDP" && (
              <PdpContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
                pharmacies={plan_data?.pharmacyCosts}
              />
            )}
            {plan_data && PLAN_TYPE_ENUMS[plan_data.planType] === "MA" && (
              <MaContent
                plan={plan_data}
                enrollData={enrollData}
                isEnroll={true}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => setShareModalOpen(true)}
              />
            )}
          </Container>
          <ContactFooter />
          <BackToTop />
        </WithLoader>
      </div>
    </>
  );
};

export default EnrollmentHistoryPage;
