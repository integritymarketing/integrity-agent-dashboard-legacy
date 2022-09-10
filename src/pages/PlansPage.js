import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams, useHistory, useLocation } from "react-router-dom";
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
import { BackToTop } from "components/ui/BackToTop";
import PlanResults, {
  convertPlanTypeToValue,
} from "components/ui/plan-results";
import PlanTypesFilter, { planTypesMap } from "components/ui/PlanTypesFilter";
import PharmacyFilter from "components/ui/PharmacyFilter";
import AdditionalFilters from "components/ui/AdditionalFilters";
import Pagination from "components/ui/Pagination/pagination";
import analyticsService from "services/analyticsService";
import { formatDate } from "utils/dates";
import { PlanPageFooter } from "./PlanPageFooter";
import { Button } from "components/ui/Button";
import Filter from "components/icons/filter";
import Radio from "components/ui/Radio";
import { scrollTop } from "utils/shared-utils/sharedUtility";

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
  planType,
  isMobile
) {
  const planTypeString = convertPlanTypeToValue(planType, planTypesMap);
  if (plansLoading) {
    return <div />;
  } else if (isMobile) {
    return (
      <div className={`${styles["plans-available"]}`}>
        <span className={`${styles["plans-type"]}`}>
          {planCount || 0} plans available
        </span>
      </div>
    );
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

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default () => {
  const { contactId: id } = useParams();
  const query = useQuery();
  const showSelected = query && query.get("preserveSelected");
  const jsonStr = sessionStorage.getItem("__plans__");
  const {
    plans: initialPlans,
    effectiveDate: initialEffectiveDate,
    planType: initialPlanType,
  } = jsonStr ? JSON.parse(jsonStr) : {};
  const initialMonth =
    showSelected && initialEffectiveDate
      ? parseInt(initialEffectiveDate?.split("-")?.[1], 10)
      : null;
  const initialeffDate = initialMonth
    ? getNextEffectiveDate(EFFECTIVE_YEARS_SUPPORTED, initialMonth - 1)
    : null;
  const initialSelectedPlans = initialPlans && showSelected ? initialPlans : [];
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
    initialeffDate || getNextEffectiveDate(EFFECTIVE_YEARS_SUPPORTED)
  );
  const [results, setResults] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState(
    initialSelectedPlans.reduce((acc, p) => {
      acc[p.id] = true;
      return acc;
    }, {})
  );
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
    (showSelected ? initialPlanType : null) ||
      history.location.state?.planType ||
      2
  );
  const [carrierList, setCarrierList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [pagedResults, setPagedResults] = useState([]);
  const [carrierFilters, setCarrierFilters] = useState([]);
  const [policyFilters, setPolicyFilters] = useState([]);
  const [rebatesFilter, setRebatesFilter] = useState(false);
  const [specialNeedsFilter, setSpecialNeedsFilter] = useState(false);
  const [filtersOpen, setfiltersOpen] = useState(false);
  const [sort_mobile, setSort_mobile] = useState(sort);
  const [planType_mobile, setPlanType_mobile] = useState(planType);
  const [effectiveDate_mobile, setEffectiveDate_mobile] = useState(
    effectiveDate
  );
  const [myAppointedPlans_mobile, setMyAppointedPlans_mobile] = useState(
    myAppointedPlans
  );
  const [specialNeedsFilter_mobile, setSpecialNeedsFilter_mobile] = useState(
    specialNeedsFilter
  );
  const [rebatesFilter_mobile, setRebatesFilter_mobile] = useState(
    rebatesFilter
  );
  const [policyFilters_mobile, setPolicyFilters_mobile] = useState(
    policyFilters
  );
  const [carrierFilters_mobile, setCarrierFilters_mobile] = useState(
    carrierFilters
  );

  const toggleAppointedPlans = (e) => {
    if (isMobile) {
      setMyAppointedPlans_mobile(e.target.checked);
    } else {
      setMyAppointedPlans(e.target.checked);
    }
  };
  const toggleNeeds = (e) => {
    if (isMobile) {
      setSpecialNeedsFilter_mobile(e.target.checked);
    } else {
      setSpecialNeedsFilter(e.target.checked);
    }
  };
  const toggleRebates = (e) => {
    if (isMobile) {
      setRebatesFilter_mobile(e.target.checked);
    } else {
      setRebatesFilter(e.target.checked);
    }
  };

  const changeFilters = (e) => {
    const { checked, value, name } = e.target;
    let policy_filters = isMobile ? policyFilters_mobile : policyFilters;
    let carrier_filters = isMobile ? carrierFilters_mobile : carrierFilters;
    const list = name === "policy" ? policy_filters : carrier_filters;
    let resultingList = [];
    if (checked === true) {
      resultingList = [...new Set([...list, value])];
    } else {
      resultingList = [...list].filter((item) => item !== value);
    }
    if (name === "policy" && isMobile) {
      setPolicyFilters_mobile(resultingList);
    } else if (name === "policy" && !isMobile) {
      setPolicyFilters(resultingList);
    }

    if (name === "carrier" && isMobile) {
      setCarrierFilters_mobile(resultingList);
    } else if (name === "carrier" && !isMobile) {
      setCarrierFilters(resultingList);
    }
  };
  const changeEffectiveDate = (value) => {
    if (isMobile) {
      setEffectiveDate_mobile(value);
    } else {
      setEffectiveDate(value);
    }
  };

  const changePlanType = (value) => {
    if (isMobile) {
      setPlanType_mobile(value);
    } else {
      setPlanType(value);
      history.push({ state: { planType: parseInt(value) } });
    }
    setSelectedPlans({});
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
    const specialNeedsPlans = specialNeedsFilter
      ? [...policyGroup].filter((plan) => plan?.planName.includes("SNP"))
      : policyGroup;

    const rebatePlans = rebatesFilter
      ? [...specialNeedsPlans].filter((plan) => {
          if (plan.planDataFields && plan.planDataFields.length > 0) {
            return plan.planDataFields.find((detail) =>
              detail.name.toLowerCase().includes("part b giveback")
            );
          } else {
            return false;
          }
        })
      : specialNeedsPlans;

    const sortedResults = [...rebatePlans]?.sort(sortFunction);
    setFilteredPlansCount(sortedResults?.length || 0);
    const slicedResults = [...sortedResults]?.slice(pagedStart, pageLimit);
    setPagedResults(slicedResults);
    // scrolling to top of the page while displaying new set of plans list with pagination
    scrollTop();
  }, [
    results,
    currentPage,
    pageSize,
    sort,
    carrierFilters,
    policyFilters,
    rebatesFilter,
    specialNeedsFilter,
  ]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  useEffect(() => {
    getAllPlans();
  }, [getAllPlans]);

  const openFilters = () => {
    setMyAppointedPlans_mobile(myAppointedPlans);
    setEffectiveDate_mobile(effectiveDate);
    setCarrierFilters_mobile(carrierFilters);
    setPolicyFilters_mobile(policyFilters);
    setRebatesFilter_mobile(rebatesFilter);
    setSpecialNeedsFilter_mobile(specialNeedsFilter);
    setPlanType_mobile(planType);
    setSort_mobile(sort);
    setfiltersOpen(true);
  };

  const resetFilters = () => {
    setMyAppointedPlans_mobile(true);
    setEffectiveDate_mobile(getNextEffectiveDate(EFFECTIVE_YEARS_SUPPORTED));
    setCarrierFilters_mobile([]);
    setPolicyFilters_mobile([]);
    setRebatesFilter_mobile(false);
    setSpecialNeedsFilter_mobile(false);
    setPlanType_mobile(2);
    setSort_mobile(PLAN_SORT_OPTIONS[0].value);
  };

  const applyFilters = () => {
    setMyAppointedPlans(myAppointedPlans_mobile);
    setEffectiveDate(effectiveDate_mobile);
    setCarrierFilters(carrierFilters_mobile);
    setPolicyFilters(policyFilters_mobile);
    setRebatesFilter(rebatesFilter_mobile);
    setSpecialNeedsFilter(specialNeedsFilter_mobile);
    setPlanType(planType_mobile);
    setSort(sort_mobile);
    setfiltersOpen(false);
  };

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
            {(!isEdit || (isEdit && isMobile)) && <GlobalNav />}
            {(isEdit || (isMobile && filtersOpen)) && (
              <FocusedNav
                backText={"Back to plans page"}
                onBackClick={() => {
                  if (isEdit) {
                    getContactRecordInfo();
                  }
                  setfiltersOpen(false);
                  setIsEdit(false);
                }}
              />
            )}
            {((contact && !isEdit && !isMobile) ||
              (isMobile && !filtersOpen && !isEdit)) && (
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

            {isMobile && !filtersOpen && !isEdit && (
              <Button
                icon={<Filter />}
                label={"Filter Plans"}
                onClick={openFilters}
                type="secondary"
                className={`${styles["filter-plans-btn"]}`}
              />
            )}

            {!isEdit && (
              <Container className={`${styles["search-container"]}`}>
                {(!isMobile || (isMobile && filtersOpen)) && (
                  <div className={`${styles["filters"]}`}>
                    {isMobile && (
                      <>
                        <div className={`${styles["plans-count-mobile"]}`}>
                          {getPlansAvailableSection(
                            filteredPlansCount,
                            plansAvailableCount,
                            plansLoading,
                            planType,
                            isMobile
                          )}
                        </div>

                        <div className={`${styles["filter-section"]}`}>
                          <div className="header">Sort By</div>

                          {effectiveDate &&
                            PLAN_SORT_OPTIONS.map((sortOption, sortIndex) => {
                              return (
                                <Radio
                                  id={sortOption.label}
                                  key={`${sortOption.label} - ${sortIndex}`}
                                  name="sortBy"
                                  value={sortOption.value}
                                  label={sortOption.label}
                                  checked={sort_mobile === sortOption.value}
                                  onChange={() =>
                                    setSort_mobile(sortOption.value)
                                  }
                                />
                              );
                            })}
                        </div>
                      </>
                    )}
                    <div className={`${styles["filter-section"]}`}>
                      {effectiveDate && (
                        <PlanTypesFilter
                          changeFilter={changePlanType}
                          initialValue={isMobile ? planType_mobile : planType}
                        />
                      )}
                    </div>
                    <div className={`${styles["filter-section"]}`}>
                      {effectiveDate && (
                        <EffectiveDateFilter
                          years={EFFECTIVE_YEARS_SUPPORTED}
                          initialValue={
                            isMobile ? effectiveDate_mobile : effectiveDate
                          }
                          onChange={(date) => changeEffectiveDate(date)}
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
                          toggleRebates={toggleRebates}
                          toggleNeeds={toggleNeeds}
                          myAppointedPlans={
                            isMobile
                              ? myAppointedPlans_mobile
                              : myAppointedPlans
                          }
                          carrierFilters={
                            isMobile ? carrierFilters_mobile : carrierFilters
                          }
                          policyFilters={
                            isMobile ? policyFilters_mobile : policyFilters
                          }
                          rebatesFilter={
                            isMobile ? rebatesFilter_mobile : rebatesFilter
                          }
                          specialNeedsFilter={
                            isMobile
                              ? specialNeedsFilter_mobile
                              : specialNeedsFilter
                          }
                        />
                      )}
                    </div>
                    {isMobile && (
                      <>
                        <div className={`${styles["filter-btn-section"]}`}>
                          <Button
                            label={"Reset Filters"}
                            onClick={resetFilters}
                            type="secondary"
                            className={`${styles["filter-grey-btn"]}`}
                          />
                          <Button
                            label={"Apply"}
                            onClick={applyFilters}
                            type="primary"
                            className={`${styles["filter-blue-btn"]}`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                {((isMobile && !filtersOpen) || !isMobile) && (
                  <div className={`${styles["results"]}`}>
                    <div className={`${styles["sort"]}`}>
                      {getPlansAvailableSection(
                        filteredPlansCount,
                        plansAvailableCount,
                        plansLoading,
                        planType,
                        isMobile
                      )}
                      {!isMobile && (
                        <div className={`${styles["sort-select"]}`}>
                          <Select
                            mobileLabel={<SortIcon />}
                            initialValue={PLAN_SORT_OPTIONS[0].value}
                            onChange={(value) => setSort(value)}
                            options={PLAN_SORT_OPTIONS}
                            prefix="Sort by: "
                          />
                        </div>
                      )}
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
                        selectedPlans={selectedPlans}
                        setSelectedPlans={setSelectedPlans}
                      />
                      {!plansLoading && filteredPlansCount > 0 && (
                        <>
                          <BackToTop />
                          <Pagination
                            currentPage={currentPage}
                            resultName="plans"
                            totalPages={Math.ceil(filteredPlansCount / 10)}
                            totalResults={filteredPlansCount}
                            pageSize={pageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
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
                  page={"plansPage"}
                />
              </Container>
            )}
          </WithLoader>
          <PlanPageFooter
            leadId={id}
            planType={planType}
            effectiveDate={formatDate(effectiveDate, "yyyy-MM-01")}
            plans={results?.filter((plan) => selectedPlans[plan.id])}
            onRemove={(plan) => {
              setSelectedPlans((prev) => ({ ...prev, [plan.id]: false }));
            }}
          />
        </div>
      </ToastContextProvider>
    </>
  );
};
