import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import GlobalNav from "partials/global-nav-v2";
import FocusedNav from "partials/focused-nav";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import ContactRecordHeader from "components/ui/ContactRecordHeader";
import { Select } from "components/ui/Select";
import WithLoader from "components/ui/WithLoader";
import styles from "./PlansPage.module.scss";
import SortIcon from "components/icons/sort";
import { PLAN_SORT_OPTIONS } from "../constants";
import EffectiveDateFilter from "components/ui/EffectiveDateFilter";
import plansService from "services/plansService";
import { getNextEffectiveDate } from "utils/dates";
import ContactEdit from "components/ui/ContactEdit";
import { ToastContextProvider } from "components/ui/Toast/ToastContext";
import PlanResults, {
  convertPlanTypeToValue,
} from "components/ui/plan-results";
import PlanTypesFilter, { planTypesMap } from "components/ui/PlanTypesFilter";
import PharmacyFilter from "components/ui/PharmacyFilter";
import AdditionalFilters from "components/ui/AdditionalFilters";
import Pagination from "components/ui/Pagination/pagination";
import analyticsService from "services/analyticsService";

const premAsc = (res1, res2) => {
  return res1.annualPlanPremium / 12 > res2.annualPlanPremium / 12
    ? 1
    : res1.annualPlanPremium / 12 < res2.annualPlanPremium / 12
    ? -1
    : 0;
};
const premDsc = (res1, res2) => {
  return res1.annualPlanPremium / 12 < res2.annualPlanPremium / 12
    ? 1
    : res1.annualPlanPremium / 12 > res2.annualPlanPremium / 12
    ? -1
    : 0;
};
const ratings = (res1, res2) => {
  return res1.planRating < res2.planRating
    ? 1
    : res1.planRating > res2.planRating
    ? -1
    : 0;
};
const drugsPrice = (res1, res2) => {
  return res1.estimatedAnnualDrugCost / 12 > res2.estimatedAnnualDrugCost / 12
    ? 1
    : res1.estimatedAnnualDrugCost / 12 < res2.estimatedAnnualDrugCost / 12
    ? -1
    : 0;
};
const getSortFunction = (sort) => {
  if (sort === PLAN_SORT_OPTIONS[1].value) {
    return premDsc;
  }
  if (sort === PLAN_SORT_OPTIONS[2].value) {
    return ratings;
  }
  if (sort === PLAN_SORT_OPTIONS[3].value) {
    return drugsPrice;
  } else {
    return premAsc;
  }
};

function getPlansAvailableSection(
  planCount,
  totalPlanCount,
  plansLoading,
  planType
) {
  const planTypeString = convertPlanTypeToValue(planType, planTypesMap);
  if (plansLoading) {
    return <div />;
  } else {
    return (
      <div className={`${styles["plans-available"]}`}>
        <span className={`${styles["plans-type"]}`}>
          {planCount || 0} {planTypeString} plans
        </span>
        {` based on your filters`}
      </div>
    );
  }
}
const EFFECTIVE_YEARS_SUPPORTED = [
  parseInt(process.env.REACT_APP_CURRENT_PLAN_YEAR || 2022),
];

export default () => {
  const { contactId: id } = useParams();
  const history = useHistory();
  const [contact, setContact] = useState();
  const [plansAvailableCount, setPlansAvailableCount] = useState(0);
  const [filteredPlansCount, setFilteredPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [myAppointedPlans, setMyAppointedPlans] = useState(true);
  const [section, setSection] = useState("details");
  const [sort, setSort] = useState(PLAN_SORT_OPTIONS[0].value);
  const [isEdit, setIsEdit] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(
    getNextEffectiveDate(EFFECTIVE_YEARS_SUPPORTED)
  );
  const [results, setResults] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      const [
        contactData,
        prescriptionData,
        providerData,
        pharmacyData,
      ] = await Promise.all([
        clientsService.getContactInfo(id),
        clientsService.getLeadPrescriptions(id),
        clientsService.getLeadProviders(id),
        clientsService.getLeadPharmacies(id),
      ]);
      setContact(contactData);
      setProviders(providerData.providers);
      setPrescriptions(prescriptionData);
      setPharmacies(pharmacyData);
      analyticsService.fireEvent("event-content-load", {
        pagePath: "/plans/:contactId",
      });
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id]);
  const [currentPage, setCurrentPage] = useState(1);
  const [planType, setPlanType] = useState(
    history.location.state?.planType || 2
  );
  const [carrierList, setCarrierList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [pagedResults, setPagedResults] = useState([]);
  const [carrierFilters, setCarrierFilters] = useState([]);
  const [policyFilters, setPolicyFilters] = useState([]);
  const toggleAppointedPlans = (e) => {
    setMyAppointedPlans(e.target.checked);
  };

  const changeFilters = (e) => {
    const { checked, value, name } = e.target;
    const list = name === "policy" ? policyFilters : carrierFilters;

    if (checked === true) {
      const itemList = [...new Set([...list, value])];
      if (name === "policy") {
        setPolicyFilters(itemList);
      } else if (name === "carrier") {
        setCarrierFilters(itemList);
      }
    } else {
      const filteredList = [...list].filter((item) => item !== value);
      if (name === "policy") {
        setPolicyFilters(filteredList);
      } else if (name === "carrier") {
        setCarrierFilters(filteredList);
      }
    }
  };
  const changePlanType = (e) => {
    setPlanType(e.target.value);
    history.push({ state: { planType: parseInt(e.target.value) } });
  };
  const getAllPlans = useCallback(async () => {
    if (contact) {
      setPlansAvailableCount(0);
      setFilteredPlansCount(0);
      setPlansLoading(true);
      try {
        setResults([]);
        setSubTypeList([]);
        setCarrierList([]);
        const plansData = await plansService.getPlans(contact.leadsId, {
          fips: contact.addresses[0].countyFips.toString(),
          zip: contact.addresses[0].postalCode.toString(),
          year: effectiveDate.getFullYear(),
          ReturnAllMedicarePlans: !myAppointedPlans,
          ShowFormulary: true,
          ShowPharmacy: true,
          PlanType: planType,
          effectiveDate: `${effectiveDate.getFullYear()}-${
            effectiveDate.getMonth() + 1
          }-01`,
        });
        setPlansAvailableCount(plansData?.medicarePlans?.length);
        setCurrentPage(1);
        setResults(plansData?.medicarePlans);
        const carriers = [
          ...new Set(plansData?.medicarePlans.map((plan) => plan.carrierName)),
        ];
        const subTypes = [
          ...new Set(
            plansData?.medicarePlans.map((plan) => plan?.planSubType || "PDP")
          ),
        ];
        setSubTypeList(subTypes);
        setCarrierList(carriers);
        analyticsService.fireEvent("event-quoting-plans");
      } catch (e) {
        Sentry.captureException(e);
      } finally {
        setPlansLoading(false);
      }
    }
  }, [contact, effectiveDate, planType, myAppointedPlans]);

  const pageSize = 10;

  useEffect(() => {
    const pagedStart = (currentPage - 1) * pageSize;
    const pageLimit = pageSize * currentPage;
    const sortFunction = getSortFunction(sort);
    const resultsList = results || [];
    const carrierGroup =
      carrierFilters.length > 0
        ? resultsList.filter((res) => carrierFilters.includes(res.carrierName))
        : resultsList;
    const policyGroup =
      policyFilters.length > 0
        ? carrierGroup.filter((res) => policyFilters.includes(res.planSubType))
        : carrierGroup;
    const sortedResults = [...policyGroup]?.sort(sortFunction);
    setFilteredPlansCount(sortedResults?.length || 0);
    const slicedResults = [...sortedResults]?.slice(pagedStart, pageLimit);
    setPagedResults(slicedResults);
  }, [results, currentPage, pageSize, sort, carrierFilters, policyFilters]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  useEffect(() => {
    getAllPlans();
  }, [getAllPlans]);

  const isLoading = loading;
  return (
    <>
      <ToastContextProvider>
        <div className={`${styles["plans-page"]}`}>
          <Media
            query={"(max-width: 500px)"}
            onChange={(isMobile) => {
              setIsMobile(isMobile);
            }}
          />
          <WithLoader isLoading={isLoading}>
            <Helmet>
              <title>MedicareCENTER - Plans</title>
            </Helmet>
            {!isEdit && <GlobalNav />}
            {isEdit && (
              <FocusedNav
                backText={"Back to plans page"}
                onBackClick={() => {
                  setIsEdit(false);
                  getContactRecordInfo();
                }}
              />
            )}
            {contact && !isEdit && (
              <div className={`${styles["header"]}`}>
                <Container>
                  <ContactRecordHeader
                    contact={contact}
                    isMobile={isMobile}
                    onEditClick={(section) => {
                      setSection(section);
                      setIsEdit(true);
                    }}
                    providersCount={providers?.length}
                    prescriptionsCount={prescriptions?.length}
                    pharmacyCount={pharmacies?.length}
                  />
                </Container>
              </div>
            )}
            {!isEdit && (
              <Container className={`${styles["search-container"]}`}>
                <div className={`${styles["filters"]}`}>
                  <div className={`${styles["filter-section"]}`}>
                    {effectiveDate && (
                      <PlanTypesFilter
                        changeFilter={changePlanType}
                        initialValue={planType}
                      />
                    )}
                  </div>
                  <div className={`${styles["filter-section"]}`}>
                    {effectiveDate && (
                      <EffectiveDateFilter
                        years={EFFECTIVE_YEARS_SUPPORTED}
                        initialValue={effectiveDate}
                        onChange={(date) => setEffectiveDate(date)}
                      />
                    )}
                  </div>

                  <div className={`${styles["filter-section"]}`}>
                    {effectiveDate && (
                      <PharmacyFilter
                        pharmacies={pharmacies}
                        onChange={() => {}}
                      />
                    )}
                  </div>

                  <div className={`${styles["filter-section"]}`}>
                    {effectiveDate && (
                      <AdditionalFilters
                        onChange={() => {}}
                        toggleAppointedPlans={toggleAppointedPlans}
                        carriers={carrierList}
                        policyTypes={subTypeList}
                        onFilterChange={changeFilters}
                      />
                    )}
                  </div>
                </div>
                <div className={`${styles["results"]}`}>
                  <div className={`${styles["sort"]}`}>
                    {getPlansAvailableSection(
                      filteredPlansCount,
                      plansAvailableCount,
                      plansLoading,
                      planType
                    )}
                    <div className={`${styles["sort-select"]}`}>
                      <Select
                        mobileLabel={<SortIcon />}
                        initialValue={PLAN_SORT_OPTIONS[0].value}
                        onChange={(value) => setSort(value)}
                        options={PLAN_SORT_OPTIONS}
                        prefix="Sort by: "
                      />
                    </div>
                  </div>
                  <div className={`${styles["plans"]}`}>
                    <PlanResults
                      plans={pagedResults}
                      isMobile={isMobile}
                      loading={plansLoading}
                      effectiveDate={effectiveDate}
                      contact={contact}
                      leadId={id}
                      pharmacies={pharmacies}
                      planType={planType}
                    />
                    {!plansLoading && filteredPlansCount > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        resultName="plans"
                        totalPages={Math.ceil(filteredPlansCount / 10)}
                        totalResults={filteredPlansCount}
                        pageSize={pageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    )}
                  </div>
                </div>
              </Container>
            )}
            {isEdit && (
              <Container className={`${styles["edit-container"]}`}>
                <ContactEdit
                  leadId={id}
                  personalInfo={contact}
                  initialSection={section}
                  initialEdit={isEdit}
                  getContactRecordInfo={getContactRecordInfo}
                  successNavigationRoute={`/plans/${id}`}
                  isMobile={isMobile}
                />
              </Container>
            )}
          </WithLoader>
        </div>
      </ToastContextProvider>
    </>
  );
};
