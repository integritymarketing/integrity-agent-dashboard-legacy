import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import useFetch from "hooks/useFetch";
import styles from "./styles.module.scss";

const DEFAULT_CARRIER_COUNT = 0;
const DEFAULT_PLAN_COUNT = 0;

export const CallScriptModal = ({
  modalOpen,
  handleClose,
  leadId,
  countyFips,
  postalCode,
}) => {
  const [carrierAndProductCounts, setCarrierAndProductCounts] = useState(null);
  const { Get: fetchCarrierAndProductCounts } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}`
  );

  const fetchCounts = useCallback(async () => {
    if (leadId && postalCode) {
      const fetchedData = await fetchCarrierAndProductCounts();
      setCarrierAndProductCounts(fetchedData);
    }
  }, [fetchCarrierAndProductCounts, leadId, postalCode]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const renderModalContent = useCallback(() => {
    return (
      <>
        <div className={styles.cmsComplianceSection}>
          To be in compliance with CMS guidelines, please read this script
          before every call.
        </div>
        <div className={styles.planInformationSection}>
          We do not offer every plan available in your area. Currently, we
          represent 0-
          {carrierAndProductCounts?.carrierCount || DEFAULT_CARRIER_COUNT}{" "}
          carriers which offer 0-
          {carrierAndProductCounts?.planCount || DEFAULT_PLAN_COUNT} products in
          your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local
          State Health Insurance Program (SHIP) to get information on all of
          your options.
        </div>
      </>
    );
  }, [carrierAndProductCounts]);

  return (
    <Modal open={modalOpen} onClose={handleClose} title="Recorded Call Script" hideFooter={true}>
      {renderModalContent()}
    </Modal>
  );
};

CallScriptModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  leadId: PropTypes.string.isRequired,
  countyFips: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
};
