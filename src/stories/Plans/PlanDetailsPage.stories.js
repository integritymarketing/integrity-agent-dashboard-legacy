import React from "react";
import withMock from "storybook-addon-mock";
import PlanDetailsPage from "pages/PlanDetailsPage";
import { MemoryRouter, Route } from "react-router-dom";
import "../../index.scss";
import { HelmetProvider } from "react-helmet-async";

// spoof logged in user
localStorage.setItem(
  "oidc.user:https://ae-api-dev.integritymarketinggroup.com/ae-identity-service:AEPortal",
  JSON.stringify({ id: 1, access_token: "a" })
);

export default {
  component: PlanDetailsPage,
  title: "Pages/PlanDetailsPage",
  decorators: [withMock],
};
const Template = () => (
  <HelmetProvider>
    <MemoryRouter initialEntries={["/456/plan/123"]}>
      <Route path="/:contactId/plan/:planId">
        <PlanDetailsPage />
      </Route>
    </MemoryRouter>
  </HelmetProvider>
);

export const PlanDetailsPageMAPD = Template.bind({});
PlanDetailsPageMAPD.parameters = {
  mockData: [
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Pharmacies",
      method: "GET",
      status: 200,
      response: [
        {
          pharmacyRecordID: 8287886,
          pharmacyID: "string",
          isMailOrder: false,
          name: "CVS Pharmacy #17306",
          address1: "1300 University Ave W",
          address2: "",
          city: "Saint Paul",
          zip: "55104",
          state: "MN",
          pharmacyPhone: "6516468002",
          pharmacyIDType: 0,
        },
      ],
    },
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/456",
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
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Plan/123?zip=92701&fips=01234",
      method: "GET",
      status: 200,
      response: {
        carrierName: "Humana",
        id: "humanaud",
        planName: "Humana Preferred PPO",
        contractID: "string",
        planSubType: "string",
        planType: 2,
        planRating: 4.5,
        annualPlanPremium: 500,
        estimatedAnnualDrugCost: 0,
        estimatedAnnualMedicalCost: 150,
        medicalDeductible: 0,
        maximumOutOfPocketCost: 0,
        outOfNetworkMaximumOutOfPocketCost: 0,
        providers: [
          {
            firstName: "John",
            lastName: "McKnight",
            degree: "string",
            specialty: "Surgeon",
            gender: "string",
            middleName: "string",
            suffix: null,
            title: "Dr",
            npi: "string",
            isPrimary: true,
            addressId: "string",
            inNetwork: true,
            address: {
              city: "St Paul",
              state: "MN",
              streetLine1: "123 Fake St",
              zipCode: "56562",
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
            name: "Walgreens",
            address1: "123 Fig Street",
            address2: "",
            city: "Atlantis",
            zip: "90210",
            state: "CA",
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
                    memberCost: 10,
                    phase: "string",
                    labelName: "Zertec",
                  },
                  {
                    memberCost: 30,
                    labelName: "Prilosec",
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
            name: "Doctor Office Visits",
            description:
              "$0-15 copay per visit. Cost share may vary depending on where the service is provided. ",
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
          {
            name: "Specialist Office Visit",
            description:
              "$40-50 copay per visit. Cost share may vary depending on where the service is provided. ",
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
            name: "2021 Summary of Benefits",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/257_0/starratings.pdf",
            linkName: "2021 Summary of Benefits",
            types: [
              {
                name: "SUMMARY_OF_BENEFITS",
              },
            ],
          },
          {
            name: "2021 Application Form",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/ACME/pdf-sample.pdf",
            linkName: "2021 Application Form",
            types: [
              {
                name: "ENROLLMENT_APPLICATION",
              },
              {
                name: "DISPLAY_ON_ENROLLMENT",
              },
            ],
          },
        ],
        planDrugCoverage: [
          {
            tierNumber: 1,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Zertec",
            ndc: "string",
            limitedAccess: true,
          },
          {
            tierNumber: 0,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Prilosec",
            ndc: "string",
            limitedAccess: true,
          },
        ],
        initialCoverageLimit: 100,
        effectiveEndDate: "2021-09-20T19:08:28.929Z",
        effectiveStartDate: "2021-09-20T19:08:28.929Z",
        nonLicensedPlan: true,
        logoURL: "string",
        drugDeductible: 0,
        estimatedAnnualDrugCostPartialYear: 120,
        formularyTiers: [
          {
            tierNumber: 1,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 500,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 10,
              },
            ],
          },
          {
            tierNumber: 2,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 45,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 85,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 3,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 4,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 22.2,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 5,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 52,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 150,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 15,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
        ],
      },
    },
  ],
};

export const PlanDetailsPagePDP = Template.bind({});
PlanDetailsPagePDP.parameters = {
  mockData: [
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Pharmacies",
      method: "GET",
      status: 200,
      response: [
        {
          pharmacyRecordID: 8287886,
          pharmacyID: "string",
          isMailOrder: false,
          name: "CVS Pharmacy #17306",
          address1: "1300 University Ave W",
          address2: "",
          city: "Saint Paul",
          zip: "55104",
          state: "MN",
          pharmacyPhone: "6516468002",
          pharmacyIDType: 0,
        },
      ],
    },
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/456",
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
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Plan/123?zip=92701&fips=01234",
      method: "GET",
      status: 200,
      response: {
        carrierName: "Humana",
        id: "humanaud",
        planName: "Humana Preferred PPO",
        contractID: "string",
        planSubType: "string",
        planType: 1,
        planRating: 4.5,
        annualPlanPremium: 1500,
        estimatedAnnualDrugCost: 0,
        estimatedAnnualMedicalCost: 120,
        medicalDeductible: 0,
        maximumOutOfPocketCost: 0,
        outOfNetworkMaximumOutOfPocketCost: 0,
        providers: [
          {
            firstName: "John",
            lastName: "McKnight",
            degree: "string",
            specialty: "Surgeon",
            gender: "string",
            middleName: "string",
            suffix: null,
            title: "Dr",
            npi: "string",
            isPrimary: true,
            addressId: "string",
            inNetwork: true,
            address: {
              city: "St Paul",
              state: "MN",
              streetLine1: "123 Fake St",
              zipCode: "56562",
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
            name: "Walgreens",
            address1: "123 Fig Street",
            address2: "",
            city: "Atlantis",
            zip: "90210",
            state: "CA",
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
                    memberCost: 10,
                    phase: "string",
                    labelName: "Zertec",
                  },
                  {
                    memberCost: 30,
                    labelName: "Prilosec",
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
            name: "Doctor Office Visits",
            description:
              "$0-15 copay per visit. Cost share may vary depending on where the service is provided. ",
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
          {
            name: "Specialist Office Visit",
            description:
              "$40-50 copay per visit. Cost share may vary depending on where the service is provided. ",
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
            name: "2021 Summary of Benefits",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/257_0/starratings.pdf",
            linkName: "2021 Summary of Benefits",
            types: [
              {
                name: "SUMMARY_OF_BENEFITS",
              },
            ],
          },
          {
            name: "2021 Application Form",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/ACME/pdf-sample.pdf",
            linkName: "2021 Application Form",
            types: [
              {
                name: "ENROLLMENT_APPLICATION",
              },
              {
                name: "DISPLAY_ON_ENROLLMENT",
              },
            ],
          },
        ],
        planDrugCoverage: [
          {
            tierNumber: 1,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Zertec",
            ndc: "string",
            limitedAccess: true,
          },
          {
            tierNumber: 0,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Prilosec",
            ndc: "string",
            limitedAccess: true,
          },
        ],
        initialCoverageLimit: 100,
        effectiveEndDate: "2021-12-20T19:08:28.929Z",
        effectiveStartDate: "2021-06-20T19:08:28.929Z",
        nonLicensedPlan: true,
        logoURL: "string",
        drugDeductible: 0,
        estimatedAnnualDrugCostPartialYear: 950,
        formularyTiers: [
          {
            tierNumber: 1,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 500,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 10,
              },
            ],
          },
          {
            tierNumber: 2,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 45,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 85,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 3,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 4,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 22.2,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 5,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 52,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 150,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 15,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
        ],
      },
    },
  ],
};

export const PlanDetailsPageMA = Template.bind({});
PlanDetailsPageMA.parameters = {
  mockData: [
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Pharmacies",
      method: "GET",
      status: 200,
      response: [
        {
          pharmacyRecordID: 8287886,
          pharmacyID: "string",
          isMailOrder: false,
          name: "CVS Pharmacy #17306",
          address1: "1300 University Ave W",
          address2: "",
          city: "Saint Paul",
          zip: "55104",
          state: "MN",
          pharmacyPhone: "6516468002",
          pharmacyIDType: 0,
        },
      ],
    },
    {
      url:
        "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/456",
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
        "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/456/Plan/123?zip=92701&fips=01234",
      method: "GET",
      status: 200,
      response: {
        carrierName: "Humana",
        id: "humanaud",
        planName: "Humana Preferred PPO",
        contractID: "string",
        planSubType: "string",
        planType: 4,
        planRating: 4.5,
        annualPlanPremium: 1500,
        estimatedAnnualDrugCost: 0,
        estimatedAnnualMedicalCost: 120,
        medicalDeductible: 0,
        maximumOutOfPocketCost: 0,
        outOfNetworkMaximumOutOfPocketCost: 0,
        providers: [
          {
            firstName: "John",
            lastName: "McKnight",
            degree: "string",
            specialty: "Surgeon",
            gender: "string",
            middleName: "string",
            suffix: null,
            title: "Dr",
            npi: "string",
            isPrimary: true,
            addressId: "string",
            inNetwork: true,
            address: {
              city: "St Paul",
              state: "MN",
              streetLine1: "123 Fake St",
              zipCode: "56562",
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
            name: "Walgreens",
            address1: "123 Fig Street",
            address2: "",
            city: "Atlantis",
            zip: "90210",
            state: "CA",
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
                    memberCost: 10,
                    phase: "string",
                    labelName: "Zertec",
                  },
                  {
                    memberCost: 30,
                    labelName: "Prilosec",
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
            name: "Doctor Office Visits",
            description:
              "$0-15 copay per visit. Cost share may vary depending on where the service is provided. ",
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
          {
            name: "Specialist Office Visit",
            description:
              "$40-50 copay per visit. Cost share may vary depending on where the service is provided. ",
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
            name: "2021 Summary of Benefits",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/257_0/starratings.pdf",
            linkName: "2021 Summary of Benefits",
            types: [
              {
                name: "SUMMARY_OF_BENEFITS",
              },
            ],
          },
          {
            name: "2021 Application Form",
            url:
              "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PDFs/ACME/pdf-sample.pdf",
            linkName: "2021 Application Form",
            types: [
              {
                name: "ENROLLMENT_APPLICATION",
              },
              {
                name: "DISPLAY_ON_ENROLLMENT",
              },
            ],
          },
        ],
        planDrugCoverage: [
          {
            tierNumber: 1,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Zertec",
            ndc: "string",
            limitedAccess: true,
          },
          {
            tierNumber: 0,
            hasQuantityLimit: true,
            hasStepTherapy: true,
            hasPriorAuthorization: true,
            labelName: "Prilosec",
            ndc: "string",
            limitedAccess: true,
          },
        ],
        initialCoverageLimit: 100,
        effectiveEndDate: "2021-12-20T19:08:28.929Z",
        effectiveStartDate: "2021-06-20T19:08:28.929Z",
        nonLicensedPlan: true,
        logoURL: "string",
        drugDeductible: 0,
        estimatedAnnualDrugCostPartialYear: 950,
        formularyTiers: [
          {
            tierNumber: 1,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 500,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 10,
              },
            ],
          },
          {
            tierNumber: 2,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 45,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 85,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 3,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: true,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 4,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 5,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 90,
                costType: 2,
                cost: 22.2,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
          {
            tierNumber: 5,
            copayPrices: [
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 52,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 1,
                cost: 150,
              },
              {
                isPreferredPharmacy: false,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 15,
              },
              {
                isPreferredPharmacy: true,
                isMailOrder: false,
                daysOfSupply: 30,
                costType: 2,
                cost: 25,
              },
            ],
          },
        ],
      },
    },
  ],
};
