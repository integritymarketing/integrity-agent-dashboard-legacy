import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Media from "react-media";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import ContactRecordHeader from "components/ui/ContactRecordHeader";
import WithLoader from "components/ui/WithLoader";
import styles from "./PlansPage.module.scss";

export default () => {
  const { contactId: id } = useParams();
  const [contact, setContact] = useState();
  const [plansAvailable] = useState(14); // TODO: Replace with real number of available once available
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const getContactRecordInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientsService.getContactInfo(id);
      setContact(data);
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getContactRecordInfo();
  }, [getContactRecordInfo]);

  const isLoading = loading;
  return (
    <React.Fragment>
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
          <div className={`${styles["plans-available"]}`}>
            {plansAvailable} Available
          </div>
        </Container>
      </WithLoader>
    </React.Fragment>
  );
};
