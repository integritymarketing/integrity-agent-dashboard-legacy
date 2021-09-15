import React from "react";
import withMock from "storybook-addon-mock";
import PlansPage from "pages/PlansPage";
import { MemoryRouter, Route } from "react-router-dom";
import "../../index.scss";
import { HelmetProvider } from "react-helmet-async";

// spoof logged in user
localStorage.setItem(
  "oidc.user:https://ae-api-dev.integritymarketinggroup.com/ae-identity-service:AEPortal",
  JSON.stringify({ id: 1, access_token: "a" })
);

export default {
  component: PlansPage,
  title: "Pages/PlansPage",
  decorators: [withMock],
};
const Template = () => (
  <HelmetProvider>
    <MemoryRouter initialEntries={["/plans/123"]}>
      <Route path="/plans/:contactId">
        <PlansPage />
      </Route>
    </MemoryRouter>
  </HelmetProvider>
);

export const PlansPageSuccess = Template.bind({});
PlansPageSuccess.parameters = {
  mockData: [
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/123",
      method: "GET",
      status: 200,
      response: {
        firstName: "Victoria",
        lastName: "Garcia",
        middleName: "R.",
        leadsId: 123,
        addresses: [
          {
            address1: "",
            address2: "",
            city: "",
            stateCode: "",
            countyFips: "01234",
            postalCode: "92701",
          },
        ],
      },
    },
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Plan",
      method: "GET",
      status: 200,
      response: {
        medicarePlans: [
          {
            carrierName: "string",
            id: "string",
            planName: "string",
            contractID: "string",
            planSubType: "string",
            planRating: 0,
            annualPlanPremium: 0,
            estimatedAnnualDrugCost: 0,
            estimatedAnnualMedicalCost: 0,
            medicalDeductible: 0,
            maximumOutOfPocketCost: 0,
            outOfNetworkMaximumOutOfPocketCost: 0,
            providers: [
              {
                firstName: "string",
                lastName: "string",
                degree: "string",
                specialty: "string",
                npi: "string",
                isPrimary: true,
                addressId: "string",
                inNetwork: true,
                address: {
                  city: "string",
                  state: "string",
                  streetLine1: "string",
                  zipCode: "string",
                  phoneNumbers: ["string"],
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
            planBenefits: [
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
            planDocuments: [
              {
                name: "string",
                url: "string",
                linkName: "string",
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
          },
        ],
      },
    },
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Plan/PlansByFilter",
      method: "POST",
      status: 200,
      response: {
        medicarePlans: [
          {
            carrierName: "string",
            id: "string",
            planName: "string",
            contractID: "string",
            planSubType: "string",
            planRating: 0,
            annualPlanPremium: 0,
            estimatedAnnualDrugCost: 0,
            estimatedAnnualMedicalCost: 0,
            medicalDeductible: 0,
            maximumOutOfPocketCost: 0,
            outOfNetworkMaximumOutOfPocketCost: 0,
            providers: [
              {
                firstName: "string",
                lastName: "string",
                degree: "string",
                specialty: "string",
                npi: "string",
                isPrimary: true,
                addressId: "string",
                inNetwork: true,
                address: {
                  city: "string",
                  state: "string",
                  streetLine1: "string",
                  zipCode: "string",
                  phoneNumbers: ["string"],
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
            planBenefits: [
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
            planDocuments: [
              {
                name: "string",
                url: "string",
                linkName: "string",
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
          },
          {
            carrierName: "string",
            id: "string",
            planName: "string",
            contractID: "string",
            planSubType: "string",
            planRating: 0,
            annualPlanPremium: 0,
            estimatedAnnualDrugCost: 0,
            estimatedAnnualMedicalCost: 0,
            medicalDeductible: 0,
            maximumOutOfPocketCost: 0,
            outOfNetworkMaximumOutOfPocketCost: 0,
            providers: [
              {
                firstName: "string",
                lastName: "string",
                degree: "string",
                specialty: "string",
                npi: "string",
                isPrimary: true,
                addressId: "string",
                inNetwork: true,
                address: {
                  city: "string",
                  state: "string",
                  streetLine1: "string",
                  zipCode: "string",
                  phoneNumbers: ["string"],
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
            planBenefits: [
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
            planDocuments: [
              {
                name: "string",
                url: "string",
                linkName: "string",
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
          },
        ],
      },
    },
  ],
};
