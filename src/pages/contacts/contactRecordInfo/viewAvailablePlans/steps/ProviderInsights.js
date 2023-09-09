import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styles from "./ProviderInsights.module.scss";
import ButtonCircleIcon from "../icons/button-circle.png";
import { STEPS } from "./index";
import useFetch from "hooks/useFetch";

const ProviderInsights = ({
  setActiveStep,
  fullName,
  leadsId,
  personalInfo,
}) => {
  const history = useHistory();
  const { Put } = useFetch(
    `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads/${leadsId}`,
    false,
    true
  );

  const handleViewPlans = async () => {
    const payload = {
      ...personalInfo,
      shouldHideSpecialistPrompt: true,
    };
    await Put(payload);
    history.push(`/plans/${leadsId}`);
  };

  const handleReviewProviders = async () => {
    const payload = {
      ...personalInfo,
      shouldHideSpecialistPrompt: true,
    };
    await Put(payload);
    setActiveStep(STEPS.REVIEW_PROVIDERS);
  };

  return (
    <div className={styles.providerInsights}>
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
      <div className={styles.actions}>
        <button onClick={handleViewPlans} className={styles.secondary}>
          View Plans
        </button>
        <button onClick={handleReviewProviders} className={styles.primary}>
          Review Providers
          <img src={ButtonCircleIcon} alt="right-arrow" />
        </button>
      </div>
      {/* <div className={styles.separator} />
      <div className={styles.footer}>
        <input type="checkbox" /> <p>Hide Provider Insights</p>
      </div> */}
    </div>
  );
};

ProviderInsights.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
  fullName: PropTypes.string,
  leadsId: PropTypes.string,
  personalInfo: PropTypes.object,
};

export default ProviderInsights;
