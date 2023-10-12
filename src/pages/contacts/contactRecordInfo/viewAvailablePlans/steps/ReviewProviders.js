import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useAnalytics from "hooks/useAnalytics";
import { toTitleCase } from "utils/toTitleCase";
import { addProviderModalAtom } from "recoil/providerInsights/atom.js";
import ArrowDown from "../icons/arrow-down.png";
import ButtonCircle from "../icons/button-circle.png";
import styles from "./ReviewProviders.module.scss";
import { useSetRecoilState } from 'recoil';

const ReviewProviders = ({
  fullName,
  providers,
  leadsId,
  rXToSpecialists,
  setShowViewAvailablePlans,
  prescriptions,
}) => {
  const navigate = useNavigate();
  const setModalOpen = useSetRecoilState(addProviderModalAtom);
  const [providersCollapsed, setProvidersCollapsed] = useState(false);
  const { fireEvent } = useAnalytics();

  useEffect(() => {
      fireEvent("AI - Provider Review Displayed", {
        leadid: leadsId,
        flow: "Rx to Specialist",
        provider_count: providers?.length,
        prescription_count: prescriptions?.length,
      });
  }, [
    fireEvent,
    leadsId,
    prescriptions,
    providers?.length,
  ]);

  const toggleProviderCollapse = useCallback(() => {
    setProvidersCollapsed((prevState) => !prevState);
  }, []);

  const viewPlans = useCallback(() => {
    navigate(`/plans/${leadsId}`);
  }, [navigate, leadsId]);

  const openAddProviderModal = useCallback(() => {
    setModalOpen(true);
    setShowViewAvailablePlans(false);
  }, [setModalOpen, setShowViewAvailablePlans]);

  return (
    <div className={styles.reviewProviders}>
      <div className={styles.chatBubble}>
        <p className={styles.title}>Provider Review</p>
        <p>
          Based on your contact’s medications, they may see a Specialist - in
          addition to a Primary Care Physician.
        </p>
        <p>
          Would you like to review <strong>{fullName}'s</strong> providers?
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
      {rXToSpecialists?.rXToSpecialistsResults?.length > 0 && (
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
            {rXToSpecialists?.rXToSpecialistsResults?.map((result, index) => (
              <div
                onClick={openAddProviderModal}
                key={index}
                className={styles.prescription}
              >
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
      )}
      <div className={styles.actions}>
        <button onClick={viewPlans} className={styles.secondary}>
          View Plans
        </button>
        <button onClick={openAddProviderModal} className={styles.primary}>
          Add a Provider
          <img src={ButtonCircle} alt="right-arrow" />
        </button>
      </div>
    </div>
  );
};

ReviewProviders.propTypes = {
  fullName: PropTypes.string.isRequired,
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      presentationName: PropTypes.string.isRequired,
      specialty: PropTypes.string.isRequired,
    })
  ).isRequired,
  leadsId: PropTypes.string.isRequired,
  rXToSpecialists: PropTypes.shape({
    rXToSpecialistsResults: PropTypes.arrayOf(
      PropTypes.shape({
        drugName: PropTypes.string.isRequired,
        specialties: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
  }).isRequired,
  setShowViewAvailablePlans: PropTypes.func.isRequired,
  prescriptions: PropTypes.array,
};

export default ReviewProviders;
