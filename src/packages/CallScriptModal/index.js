import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";
import WithLoader from "components/ui/WithLoader";
import useFetch from "hooks/useFetch";
import styles from "./styles.module.scss";
import { DEFAULT_EFFECTIVE_YEAR } from "utils/dates";

const DEFAULT_CARRIER_COUNT = `0-78`;
const DEFAULT_PLAN_COUNT = `0-2,613`;

export const CallScriptModal = ({
  modalOpen,
  handleClose,
  leadId,
  countyFips,
  postalCode,
  carrierAndProductData,
}) => {
  const [carrierProductData, setCarrierProductData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { Get: fetchCarrierProductData } = useFetch(
    `${process.env.REACT_APP_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}&Year=${DEFAULT_EFFECTIVE_YEAR}`
  );

  const fetchCounts = useCallback(async () => {
    if (leadId && postalCode) {
      setIsLoadingData(true);
      const fetchedData = await fetchCarrierProductData();
      setCarrierProductData(fetchedData);
      setIsLoadingData(false);
    }
  }, [fetchCarrierProductData, leadId, postalCode]);

  useEffect(() => {
    if (!carrierAndProductData) {
      fetchCounts();
    }
    setCarrierProductData(carrierAndProductData);
  }, [fetchCounts, carrierAndProductData]);

  let carrierCount = DEFAULT_CARRIER_COUNT;
  let productCount = DEFAULT_PLAN_COUNT;

  if (countyFips && carrierProductData) {
    carrierCount = carrierProductData.carrierCount || DEFAULT_CARRIER_COUNT;
    productCount = carrierProductData.planCount || DEFAULT_PLAN_COUNT;
  }

  const renderModalContent = useCallback(
    () => (
      <WithLoader isLoading={isLoadingData}>
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
        {!carrierProductData && !postalCode && !carrierAndProductData && (
          <div className={styles.planInformationSection}>
            Exact carrier and plan counts are determined by your zip code and
            county.
          </div>
        )}
      </WithLoader>
    ),
    [
      carrierAndProductData,
      carrierCount,
      carrierProductData,
      isLoadingData,
      postalCode,
      productCount,
    ]
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
