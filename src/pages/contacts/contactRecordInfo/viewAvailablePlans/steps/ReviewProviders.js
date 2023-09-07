import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import useFetch from "hooks/useFetch";
import { toTitleCase } from "utils/toTitleCase";
import { addProviderModalAtom } from "recoil/providerInsights/atom.js";
import ProviderModal from "components/SharedModals/ProviderModal";
import ArrowDown from "../icons/arrow-down.png";
import ButtonCircle from "../icons/button-circle.png";
import styles from "./ReviewProviders.module.scss";

const ReviewProviders = ({
  fullName,
  birthdate,
  prescriptions,
  providers,
  leadId,
  personalInfo,
  refreshAvailablePlans,
}) => {
  const userZipCode = personalInfo?.addresses?.[0]?.postalCode;
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useRecoilState(addProviderModalAtom);
  const [providersCollapsed, setProvidersCollapsed] = useState(false);
  const { data, Post: postSpecialists } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/Rxspecialists/${leadId}?api-version=1.0`
  );
  const { Post: postAddProvider } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/api/v1.0/Lead/${leadId}/Provider`
  );

  const toggleProviderCollapse = useCallback(() => {
    setProvidersCollapsed((prevState) => !prevState);
  }, []);

  const viewPlans = useCallback(() => {
    history.push(`/plans/${leadId}`);
  }, [history, leadId]);

  const openAddProviderModal = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);

  const handleSaveProvider = async (payload) => {
    await postAddProvider(payload);
    await refreshAvailablePlans?.();
  };

  useEffect(() => {
    const payload = {
      birthDate: birthdate,
      rxDetails: prescriptions?.map(({ dosage: { ndc, drugName } }) => ({
        ndc,
        drugName,
      })),
      providerDetails: providers?.map(({ presentationName, specialty }) => ({
        providerName: presentationName,
        providerSpecialty: specialty,
      })),
    };
    postSpecialists(payload);
  }, [postSpecialists, birthdate, prescriptions, providers]);

  return (
    <div className={styles.reviewProviders}>
      <div className={styles.chatBubble}>
        <p className={styles.title}>Provider Review</p>
        <p>
          Based on your contact’s medications, they may see a Specialist - in
          addition to a Primary Care Physician.
        </p>
        <p>
          Would you like to review <strong>{fullName}</strong> providers?
        </p>
      </div>
      <div className={styles.currentProviders}>
        <div className={styles.header}>
          <img
            onClick={toggleProviderCollapse}
            className={providersCollapsed ? styles.collapsed : ""}
            src={ArrowDown}
            alt="arrow-down"
          />
          <p>{`Current Providers (${providers?.length})`}</p>
        </div>
        {providersCollapsed && <hr className={styles.providerCollapsed} />}
        {!providersCollapsed && (
          <div className={styles.providersList}>
            {providers?.map((provider, index) => (
              <div key={index} className={styles.provider}>
                <p className={styles.title}>{provider.specialty}</p>
                <p className={styles.value}>
                  {toTitleCase(provider.presentationName)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.potentialSpecialists}>
        <div className={styles.header}>
          <p className={styles.title}>Potential Specialists</p>
          <p>
            Your Contact may potentially see a specialist for the following
            prescriptions. These prescriptions may also be prescribed by their
            primary care physician.
          </p>
        </div>
        <div className={styles.prescriptions}>
          {data?.rXToSpecialistsResults?.map((result, index) => (
            <div key={index} className={styles.prescription}>
              <div className={styles.header}>
                <div className={styles.title}>Prescription</div>
                <div className={styles.value}>
                  {toTitleCase(result.drugName)}
                </div>
              </div>
              <div className={styles.content}>
                {result.specialties?.map((specialty, sIndex) => (
                  <div key={sIndex} className={styles.type}>
                    <p>{toTitleCase(specialty)}</p>
                    <img src={ButtonCircle} alt="button-circle" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={viewPlans} className={styles.secondary}>
          View Plans
        </button>
        <button onClick={openAddProviderModal} className={styles.primary}>
          Add a Provider
          <img src={ButtonCircle} alt="right-arrow" />
        </button>
      </div>
      {isModalOpen && (
        <ProviderModal
          open={isModalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          onSave={handleSaveProvider}
          userZipCode={userZipCode}
          leadId={leadId}
        />
      )}
    </div>
  );
};

ReviewProviders.propTypes = {
  fullName: PropTypes.string.isRequired,
  birthdate: PropTypes.string.isRequired,
  prescriptions: PropTypes.arrayOf(
    PropTypes.shape({
      dosage: PropTypes.shape({
        ndc: PropTypes.string.isRequired,
        drugName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      presentationName: PropTypes.string.isRequired,
      specialty: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  leadId: PropTypes.string.isRequired,
  personalInfo: PropTypes.shape({
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        postalCode: PropTypes.string,
      })
    ),
  }),
  refreshAvailablePlans: PropTypes.func,
};

export default ReviewProviders;
