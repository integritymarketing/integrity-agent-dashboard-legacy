import React from "react";
import { useHistory } from "react-router";
import PlanCard from "./PlanCard";
import PlanCardLoader from "./PlanCard/loader";
import plansService from "services/plansService";
import useToast from "hooks/useToast";
import * as Sentry from "@sentry/react";

const PlanResults = ({
  plans,
  isMobile,
  effectiveDate,
  leadId,
  contact,
  pharmacies,
}) => {
  const history = useHistory();
  const addToast = useToast();
  const cards = [];
  const pharmacyMap = pharmacies.reduce((dict, item) => {
    dict[item["pharmacyID"]] = item;
    return dict;
  }, {});
  if (plans && plans.length) {
    for (const plan of plans) {
      cards.push(
        <PlanCard
          planData={plan}
          effectiveDate={effectiveDate}
          isMobile={isMobile}
          pharmacyMap={pharmacyMap}
          onDetailsClick={() => history.push(`/${leadId}/plan/${plan.id}`)}
          onEnrollClick={async () => {
            try {
              const enrolled = await plansService.enroll(leadId, plan.id, {
                firstName: contact.firstName,
                middleInitial:
                  contact.middleName.length > 1 ? contact.middleName[0] : "",
                lastName: contact.lastName,
                address1: contact.addresses[0].address1,
                address2: contact.addresses[0].address2,
                city: contact.addresses[0].city,
                state: contact.addresses[0].state,
                zip: contact.addresses[0].postalCode,
                countyFIPS: contact.addresses[0].countyFips,
                phoneNumber: contact.phones[0].leadPhone,
                email: contact.emails[0].leadEmail,
                effectiveDate: effectiveDate.toISOString(),
              });

              if (enrolled && enrolled.url) {
                addToast({
                  type: "success",
                  message: "Successfully Enrolled",
                });
                window.open(enrolled.url, "_blank").focus();
              } else {
                addToast({
                  type: "error",
                  message: "There was an error enrolling the contact.",
                });
              }
            } catch (e) {
              Sentry.captureException(e);
            }
          }}
        />
      );
    }
  } else {
    for (let i = 0; i < 10; i++) {
      cards.push(<PlanCardLoader key={i}></PlanCardLoader>);
    }
  }
  return <>{cards}</>;
};

export default PlanResults;
