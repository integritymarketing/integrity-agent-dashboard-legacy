import React, { useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import ContactContext from "contexts/contacts";
import ShareIcon from "components/icons/share2";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";
import SOA_CARD from "./soaCard";
import { Button } from "components/ui/Button";
import ArrowDownIcon from "components/icons/arrow-down";
import SOAModal from "./SOAModal";

const ScopeOfAppointment = ({ setDisplay, isMobile, personalInfo, id }) => {
  const MINIMUM_SHOW_SIZE = 3;
  const [openModal, setOpenModal] = useState(false);
  const [soaList, setSoaList] = useState([]);
  const [showSize, setShowSize] = useState(MINIMUM_SHOW_SIZE);
  const { setNewSoaContactDetails } = useContext(ContactContext);
  const [showMore, setShowMore] = useState(false);

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
    setNewSoaContactDetails(contact);
  }, [setNewSoaContactDetails, contact]);

  return (
    <div data-gtm="section-scope-of-appointment" className="contactdetailscard">
      <SOAModal
        id={id}
        openSOAModal={openModal}
        setOpenSOAModal={setOpenModal}
      />

      {isMobile ? (
        <div className="soa-mobile-header">
          <div className={"soa-header-text"}> </div>
          <div
            className={"shareBtnContainer"}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className={"shareText"}>Send New</span>
            <ShareIcon />
          </div>
        </div>
      ) : (
        <div className="scope-details-card-header contactdetailscardheader">
          <h4 style={{ width: "80%" }}>Scope of Appointments</h4>
          <div className="send-btn2">
            <Button
              label="Send New"
              onClick={() => {
                setOpenModal(true);
              }}
              type="secondary"
              icon={<ShareIcon />}
              iconPosition="right"
            />
          </div>
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
            <button
              className="link"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Send a scope of appointment
            </button>
          </div>
        )}

        <div
          className="scope-of-app-row-show-more"
          onClick={(e) => {
            e.stopPropagation();
            setShowMore(!showMore);
          }}
        >
          {soaList?.length > MINIMUM_SHOW_SIZE && (
            <div>
              {showMore ? (
                <ArrowDownIcon className="cost-arrow-side" />
              ) : (
                <ArrowDownIcon />
              )}
              <button
                className="show--more--btn"
                onClick={() => {
                  if (!showMore) {
                    setShowSize(soaList?.length);
                  } else {
                    setShowSize(MINIMUM_SHOW_SIZE);
                  }
                }}
              >
                Show More
              </button>
            </div>
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
