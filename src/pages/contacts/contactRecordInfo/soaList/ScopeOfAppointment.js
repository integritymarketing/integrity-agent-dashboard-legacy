import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ContactContext from "contexts/contacts";
import ScopeSendIcon from "components/icons/scope-send";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import SOA_CARD from "./soaCard";

export default ({ setDisplay, ...rest }) => {
  const [soaList, setSoaList] = useState([]);
  const [showSize, setShowSize] = useState(5);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    (async () => {
      if (!rest || !rest.id) {
        setSoaList([]);
        return;
      }

      await clientsService
        .getSoaListByLeadId(rest?.id)
        .then((data) => {
          setSoaList([...data]);
        })
        .catch((e) => {
          Sentry.captureException(e);
        });
    })();
  }, [rest?.id]);

  const history = useHistory();
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const contact = { ...rest?.personalInfo };

  useEffect(() => {
    setNewSoaContactDetails(contact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToSOANew = () => {
    history.push("/new-soa");
  };
  return (
    <div className="contactdetailscard">
      <div className="scope-details-card-header contactdetailscardheader">
        <h4>Scope of Appointments</h4>
        <button
          className="send-btn"
          onClick={navigateToSOANew}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <ScopeSendIcon hover={hovered} />
          <span>Send</span>
        </button>
      </div>
      <div className="contactdetailscardbody">
        {soaList &&
          soaList?.length > 0 &&
          soaList?.map((soa, index) => {
            if (index < showSize) {
              return <SOA_CARD {...soa} key={index} id={rest?.id} />;
            } else return null;
          })}
        {(!soaList || soaList.length === 0) && (
          <div className="no-items">
            <span>This contact has no scope of appointments.&nbsp;</span>
            <button className="link" onClick={navigateToSOANew}>
              Send a scope of appointment
            </button>
          </div>
        )}

        <div className="scope-of-app-row-show-more">
          {showSize < soaList?.length && (
            <button
              className="show--more--btn"
              onClick={() => setShowSize(showSize + 5)}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
