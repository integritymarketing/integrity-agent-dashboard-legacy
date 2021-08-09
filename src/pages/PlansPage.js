import React, { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GlobalNav from "partials/global-nav-v2";
import Container from "components/ui/container";
import clientsService from "services/clientsService";
import ContactRecordHeader from "components/ui/ContactRecordHeader";
import WithLoader from "components/ui/WithLoader";

export default () => {
  const { contactId: id } = useParams();
  const [contact, setContact] = useState();
  const [loading, setLoading] = useState(true);

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
      <WithLoader isLoading={isLoading}>
        <Helmet>
          <title>MedicareCENTER - Plans</title>
        </Helmet>
        <GlobalNav />
        <Container id="main-content">
          {contact && (
            <ContactRecordHeader
              contact={contact}
              /* TODO: Replace with real provider/prescription/pharmacy data once available */
              providersCount={5}
              prescriptionsCount={3}
              pharmacyCount={1}
            />
          )}
        </Container>
      </WithLoader>
    </React.Fragment>
  );
};
