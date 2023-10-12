import React from "react";
import withMock from "storybook-addon-mock";
import PlansPage from "pages/PlansPage";
import { MemoryRouter, Route } from "react-router-dom";
import "../../index.scss";
import { HelmetProvider } from "react-helmet-async";
import { CountyProvider } from "contexts/counties";
import { DeleteLeadProvider } from "contexts/deleteLead";

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
  <DeleteLeadProvider>
    <CountyProvider>
      <HelmetProvider>
        <MemoryRouter initialEntries={["/plans/123"]}>
          <Route path="/plans/:contactId" element={<PlansPage />} />
        </MemoryRouter>
      </HelmetProvider>
    </CountyProvider>
  </DeleteLeadProvider>
);

export const PlansPageSuccess = Template.bind({});
PlansPageSuccess.parameters = {
  mockData: [
    {
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Provider/ProviderSearchLookup",
      method: "GET",
      status: 200,
      response: {
        total: 3,
        providers: [
          {
            email: null,
            gender: "M",
            NPI: 1720183171,
            firstName: "RANJIT",
            lastName: "JOHN",
            middleName: null,
            suffix: null,
            title: null,
            specialty: "Surgery",
            organizationName: null,
            presentationName: "RANJIT JOHN",
            phone: "6126253600",
            isIndividual: true,
            type: "individual",
            addresses: [
              {
                city: "Saint Paul",
                latitude: 44.95556,
                longitude: -93.17206,
                state: "MN",
                streetLine1: "1700 University Ave W Fl 6",
                streetLine2: null,
                zipCode: "55104",
                id: "2ae3b531-d5d1-3da4-8aeb-42de1a67ad76",
                phoneNumbers: ["6512322273"],
              },
            ],
          },
          {
            email: null,
            gender: "M",
            NPI: 1972563864,
            firstName: "COLEMAN",
            lastName: "SMITH",
            middleName: "I",
            suffix: null,
            title: null,
            specialty: "Internal Medicine",
            organizationName: null,
            presentationName: "COLEMAN I SMITH",
            phone: "6128705557",
            isIndividual: true,
            type: "individual",
            addresses: [
              {
                city: "Saint Paul",
                latitude: 44.96126,
                longitude: -93.19113,
                state: "MN",
                streetLine1: "2200 University Ave W Ste 120",
                streetLine2: null,
                zipCode: "55114",
                id: "e9355ed1-b3bd-349e-a3eb-c6b155cf3987",
                phoneNumbers: ["6128711145"],
              },
            ],
          },
          {
            email: null,
            gender: "F",
            NPI: 1922380757,
            firstName: "BRYNN",
            lastName: "SMITH",
            middleName: "KATHRYN",
            suffix: null,
            title: null,
            specialty: "Social Worker",
            organizationName: null,
            presentationName: "BRYNN KATHRYN SMITH",
            phone: "6124364840",
            isIndividual: true,
            type: "individual",
            addresses: [
              {
                city: "Saint Paul",
                latitude: 44.94751,
                longitude: -93.12786,
                state: "MN",
                streetLine1: "649 Dayton Ave",
                streetLine2: null,
                zipCode: "55104",
                id: "ef2466cb-7947-386e-920c-2c6dd058fb51",
                phoneNumbers: ["6124362604", "6124364800", "6124364840"],
              },
            ],
          },
        ],
      },
    },
    {
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/123",
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
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Plan?fips=01234&zip=92701&year=2021&ReturnAllMedicarePlans=true&ShowFormulary=true&ShowPharmacy=true&effectiveDate=2021-10-01&sort=premium%3Aasc",
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
  ],
};
const planDataValues = [
  {
    PlanName: "Medicare Prime and Complete",
    LogoURL: "",
    CarrierName: "HealthPartners",
    MedicalPremium: 25.2,
    MedicalDeductible: 0,
    MaximumOutOfPocketCost: 50,
    DrugDeductible: 20,
    EstimatedAnnualDrugCostPartialYear: 250,
    id: "planID",
    contractID: "string",
    planSubType: "string",
    planType: 3,
    PlanRating: 3.5,
    annualPlanPremium: 245,
    estimatedAnnualDrugCost: 0,
    estimatedAnnualMedicalCost: 0,
    medicalDeductible: 0,
    maximumOutOfPocketCost: 0,
    outOfNetworkMaximumOutOfPocketCost: 0,
    providers: [
      {
        firstName: "Cam",
        lastName: "Newton",
        degree: "MD",
        specialty: "PCP",
        npi: "string",
        isPrimary: true,
        addressId: "string",
        inNetwork: true,
        address: {
          city: "Boston",
          state: "MA",
          streetLine1: "111 Fake St.",
          zipCode: "02111",
          phoneNumbers: ["string"],
        },
      },
      {
        firstName: "Derek",
        lastName: "Carr",
        degree: "MD",
        specialty: "PCP",
        npi: "string",
        isPrimary: true,
        addressId: "string",
        inNetwork: true,
        address: {
          city: "Las Vegas",
          state: "LV",
          streetLine1: "1 Championship Drive",
          zipCode: "88901",
          phoneNumbers: ["string"],
        },
      },
      {
        firstName: "Ladainian",
        lastName: "Tomlinson",
        degree: "MD",
        specialty: "PCP",
        npi: "string",
        isPrimary: true,
        addressId: "string",
        inNetwork: true,
        address: {
          city: "Los Angeles",
          state: "CA",
          streetLine1: "1818 Melrose Place Drive",
          zipCode: "90210",
          phoneNumbers: ["string"],
        },
      },
      {
        firstName: "Michael",
        lastName: "Scott",
        degree: "MD",
        specialty: "PCP",
        npi: "string",
        isPrimary: true,
        addressId: "string",
        inNetwork: false,
        address: {
          city: "Los Angeles",
          state: "CA",
          streetLine1: "123 Wagner Way",
          zipCode: "90210",
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
        name: "CVS",
        address1: "123 Pharmacy Rd",
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
      {
        pharmacyType: 0,
        specifiedPharmacy: true,
        pharmacyID: "string",
        isMailOrder: true,
        name: "Walgreens",
        address1: "123 Other Pharmacy Lane",
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
        isNetwork: false,
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
    effectiveEndDate: "2021-09-07T17:41:12.304Z",
    effectiveStartDate: "2021-09-07T17:41:12.304Z",
  },
];

export const PlansPageCards = Template.bind({});
PlansPageCards.parameters = {
  mockData: [
    {
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/123",
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
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Plan",
      method: "GET",
      status: 200,
      response: {
        medicarePlans: planDataValues,
      },
    },
    {
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-quote-service/api/v1.0/Lead/123/Plan/PlansByFilter",
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
