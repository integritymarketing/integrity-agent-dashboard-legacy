import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import useFetch from "hooks/useFetch";
import styles from "./styles.module.scss";
import { DEFAULT_EFFECTIVE_YEAR } from "utils/dates";

const DEFAULT_CARRIER_COUNT = 78;
const DEFAULT_PLAN_COUNT = "2,613";

export const CallScriptModal = ({
  modalOpen,
  handleClose,
  leadId,
  countyFips,
  postalCode,
}) => {
  const [carrierProductData, setCarrierProductData] = useState(null);
  const { Get: fetchCarrierProductData } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}&Year=${DEFAULT_EFFECTIVE_YEAR}`
  );

  const fetchCounts = useCallback(async () => {
    if (leadId && postalCode) {
      const fetchedData = await fetchCarrierProductData();
      setCarrierProductData(fetchedData);
    }
  }, [fetchCarrierProductData, leadId, postalCode]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, countyFips, postalCode]);

  let carrierCount = countyFips
    ? carrierProductData?.carrierCount || DEFAULT_CARRIER_COUNT
    : `0-${carrierProductData?.carrierCount || DEFAULT_CARRIER_COUNT}`;

  let productCount = countyFips
    ? carrierProductData?.planCount || DEFAULT_PLAN_COUNT
    : `0-${carrierProductData?.planCount || DEFAULT_PLAN_COUNT}`;

  const renderModalContent = useCallback(
    () => (
      <>
        <div className={styles.cmsComplianceSection}>
          To be in compliance with CMS guidelines, please read this script
          before every call.
        </div>
        <div className={styles.planInformationSection}>
          We do not offer every plan available in your area. Currently, we
          represent {carrierCount} organizations which offer {productCount}{" "}
          products in your area. Please contact medicare.gov, 1-800-MEDICARE, or
          your local State Health Insurance Program (SHIP) to get information on
          all of your options.
        </div>
      </>
    ),
    [carrierCount, productCount]
  );

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      title="Recorded Call Script"
      hideFooter
    >
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
