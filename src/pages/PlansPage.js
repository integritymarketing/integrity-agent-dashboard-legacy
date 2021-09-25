import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
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
import PlanResults from "components/ui/plan-results";
import PlanTypesFilter, { planTypesMap } from "components/ui/PlanTypesFilter";
import PharmacyFilter from "components/ui/PharmacyFilter";
import AdditionalFilters from "components/ui/AdditionalFilters";
import Pagination from "components/ui/Pagination/pagination";
import analyticsService from "services/analyticsService";

const convertPlanTypeToValue = (value) => {
  const type = planTypesMap.find((element) => element.value === value);
  return type?.label;
};

function getPlansAvailableSection(plansAvailableCount, planType) {
  if (plansAvailableCount == null) {
    return <div>No plans returned</div>;
  } else {
    return (
      <div className={`${styles["plans-available"]}`}>
        <span className={`${styles["plans-type"]}`}>
          {plansAvailableCount} {convertPlanTypeToValue(planType)} plans
        </span>{" "}
        based on your filters
      </div>
    );
  }
}
const EFFECTIVE_YEARS_SUPPORTED = [
  parseInt(process.env.REACT_APP_CURRENT_PLAN_YEAR || 2022),
];

export default () => {
  const { contactId: id } = useParams();
  const [contact, setContact] = useState();
  const [plansAvailableCount, setPlansAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [myAppointedPlans, setMyAppointedPlans] = useState(true);
  const [section, setSection] = useState("details");
  const [sort, setSort] = useState("premium:asc");
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
  const [planType, setPlanType] = useState(2);
  const [carrierList, setCarrierList] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);
  const toggleAppointedPlans = (e) => {
    setMyAppointedPlans(e.target.checked);
  };
  const changePlanType = (e) => {
    setPlanType(e.target.value);
  };
  const getAllPlans = useCallback(async () => {
    if (contact) {
      try {
        setResults([]);
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
          sort: sort, // TODO: sort on the frontend
        });
        setPlansAvailableCount(plansData?.medicarePlans?.length);
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
      }
    }
  }, [contact, effectiveDate, planType, myAppointedPlans, sort]);

  //const filteredPlanList = useRecoilValue(filteredPlans);

  //const [filtersList, setFiltersList] = useRecoilState(filterList);

  const pageSize = 10;

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
                      <PlanTypesFilter changeFilter={changePlanType} />
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
                      />
                    )}
                  </div>
                </div>
                <div className={`${styles["results"]}`}>
                  <div className={`${styles["sort"]}`}>
                    {getPlansAvailableSection(plansAvailableCount, planType)}
                    <div className={`${styles["sort-select"]}`}>
                      <Select
                        mobileLabel={<SortIcon />}
                        initialValue="premium:asc"
                        onChange={(value) => setSort(value)}
                        options={PLAN_SORT_OPTIONS}
                        prefix="Sort by: "
                      />
                    </div>
                  </div>
                  <div className={`${styles["plans"]}`}>
                    <PlanResults
                      plans={results}
                      isMobile={isMobile}
                      effectiveDate={effectiveDate}
                      contact={contact}
                      leadId={id}
                      pharmacies={pharmacies}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(results?.length / 10)}
                      totalResults={results?.length}
                      pageSize={pageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
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
