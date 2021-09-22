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

function getPlansAvailableSection(plansAvailableCount) {
  if (plansAvailableCount == null) {
    return <div></div>;
  } else {
    return (
      <div className={`${styles["plans-available"]}`}>
        <span className={`${styles["plans-type"]}`}>
          {/* TODO specifiy type based on filters. i.e. "10 Mediacre Suppliment plans based on your filters" */}
          {plansAvailableCount} Medicare Suppliment plans
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
  const [plansAvailableCount, setPlansAvailableCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getAllPlans = useCallback(async () => {
    if (contact) {
      try {
        setResults([]);
        const plansData = await plansService.getPlans(contact.leadsId, {
          fips: contact.addresses[0].countyFips.toString(),
          zip: contact.addresses[0].postalCode.toString(),
          year: effectiveDate.getFullYear(),
          ReturnAllMedicarePlans: true,
          ShowFormulary: true,
          ShowPharmacy: true,
          effectiveDate: `${effectiveDate.getFullYear()}-${
            effectiveDate.getMonth() + 1
          }-01`,
          sort: sort, // TODO: sort on the frontend
        });
        setPlansAvailableCount(plansData?.medicarePlans?.length);
        setResults(plansData?.medicarePlans);
      } catch (e) {
        Sentry.captureException(e);
      }
    }
  }, [contact, effectiveDate, sort]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  useEffect(() => {
    getAllPlans();
  }, [getAllPlans]);

  const isLoading = loading;
  return (
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
              onBackClick={() => setIsEdit(false)}
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
                  providersCount={providers.length}
                  prescriptionsCount={prescriptions.length}
                  pharmacyCount={pharmacies.length}
                />
              </Container>
            </div>
          )}
          {!isEdit && (
            <Container className={`${styles["search-container"]}`}>
              <div className={`${styles["filters"]}`}>
                <div className={`${styles["section"]}`}>
                  {effectiveDate && (
                    <EffectiveDateFilter
                      years={EFFECTIVE_YEARS_SUPPORTED}
                      initialValue={effectiveDate}
                      onChange={(date) => setEffectiveDate(date)}
                    />
                  )}
                </div>
              </div>
              <div className={`${styles["results"]}`}>
                <div className={`${styles["sort"]}`}>
                  {getPlansAvailableSection(plansAvailableCount)}
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
  );
};
