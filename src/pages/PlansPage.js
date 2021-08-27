import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import GlobalNav from "partials/global-nav-v2";
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

const EFFECTIVE_YEARS_SUPPORTED = [2022];
export default () => {
  const { contactId: id } = useParams();
  const [contact, setContact] = useState();
  const [plansAvailableCount, setPlansAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sort, setSort] = useState("premium:asc");
  const [effectiveDate, setEffectiveDate] = useState(
    getNextEffectiveDate(EFFECTIVE_YEARS_SUPPORTED)
  );
  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      const contactData = await clientsService.getContactInfo(id);
      setContact(contactData);
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const filterPlans = useCallback(async () => {
    if (contact) {
      const plansData = await plansService.filterPlans(contact.leadsId, {
        fips: contact.addresses[0].countyFips.toString(),
        zip: contact.addresses[0].postalCode.toString(),
        // year: effectiveDate.getFullYear(),
        year: "2021", // TODO: remove hardcoded year and uncomment above, once API supports 2022
        sort: sort,
      });
      setPlansAvailableCount(plansData.medicarePlans.length);
    }
  }, [contact, sort /*, effectiveDate*/]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  useEffect(() => {
    filterPlans();
  }, [filterPlans]);

  const isLoading = loading;
  return (
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
        <GlobalNav />
        <div className={`${styles["header"]}`}>
          <Container>
            {contact && (
              <ContactRecordHeader
                contact={contact}
                isMobile={isMobile}
                /* TODO: Replace with real provider/prescription/pharmacy data once available */
                providersCount={5}
                prescriptionsCount={3}
                pharmacyCount={1}
              />
            )}
          </Container>
        </div>
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
              <div className={`${styles["plans-available"]}`}>
                <span className={`${styles["plans-type"]}`}>
                  {/* TODO specifiy type based on filters. i.e. "10 Mediacre Suppliment plans based on your filters" */}
                  {plansAvailableCount} Medicare Suppliment plans
                </span>{" "}
                based on your filters
              </div>
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
            <div className={`${styles["plans"]}`}></div>
          </div>
        </Container>
      </WithLoader>
    </div>
  );
};
