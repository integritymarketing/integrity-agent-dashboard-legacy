import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import ContactContext from "contexts/contacts";
import BackNavContext from "contexts/backNavProvider";
import ScopeSendIcon from "components/icons/scope-send";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import SOA_CARD from "./soaCard";
import SharePlan from "components/icons/sharePlan";

const ScopeOfAppointment = ({ setDisplay, isMobile, personalInfo, id }) => {
  const [soaList, setSoaList] = useState([]);
  const [showSize, setShowSize] = useState(5);
  const [hovered, setHovered] = useState(false);
  const history = useHistory();
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const { setCurrentPage } = useContext(BackNavContext);

  const contact = useMemo(() => ({ ...personalInfo }), [personalInfo]);

  useEffect(() => {
    const fetchSoaList = async () => {
      if (!id) {
        setSoaList([]);
        return;
      }
      try {
        const data = await clientsService.getSoaListByLeadId(id);
        setSoaList(data);
      } catch (e) {
        Sentry.captureException(e);
      }
    };
    fetchSoaList();
  }, [id]);

  useEffect(() => {
    setCurrentPage("Contact Detail Page");
  }, [setCurrentPage]);

  useEffect(() => {
    setNewSoaContactDetails(contact);
  }, [setNewSoaContactDetails, contact]);

  const navigateToSOANew = useCallback(() => {
    history.push(`/new-soa/${id}`);
  }, [history, id]);

  return (
    <div data-gtm="section-scope-of-appointment" className="contactdetailscard">
      {isMobile ? (
        <div className="soa-mobile-header">
          <div className={"soa-header-text"}>Scope of Appointments </div>
          <div className={"shareBtnContainer"} onClick={navigateToSOANew}>
            <SharePlan />
            <span className={"shareText"}>Send New</span>
          </div>
        </div>
      ) : (
        <div className="scope-details-card-header contactdetailscardheader">
          <h4>Scope of Appointments</h4>
          <button
            data-gtm="button-send"
            className="send-btn"
            onClick={navigateToSOANew}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <ScopeSendIcon hover={hovered} />
            <span>Send</span>
          </button>
        </div>
      )}
      <div
        className="soa-list-body contactdetailscardbody"
        data-gtm="section-item"
      >
        {soaList &&
          soaList?.length > 0 &&
          soaList?.map((soa, index) => {
            if (index < showSize) {
              return <SOA_CARD {...soa} key={index} id={id} />;
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

ScopeOfAppointment.propTypes = {
  setDisplay: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  personalInfo: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default ScopeOfAppointment;
