import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import WithLoader from "components/ui/WithLoader";
import useFetch from "hooks/useFetch";
import styles from "./CMSCompliance.module.scss";
import { DEFAULT_EFFECTIVE_YEAR } from "utils/dates";
import { CallScriptModal } from "packages/CallScriptModal";

const DEFAULT_CARRIER_COUNT = "0-78";
const DEFAULT_PLAN_COUNT = "0-2,613";

const CMSCompliance = ({ leadId, countyFips, postalCode }) => {
  const [carrierAndProductData, setCarrierAndProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallScriptModalOpen, setIsCallScriptModalOpen] = useState(false);

  const { Get: fetchCarrierAndProductData } = useFetch(
    `${import.meta.env.VITE_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}&Year=${DEFAULT_EFFECTIVE_YEAR}`
  );

  const fetchCarrierAndProductCounts = useCallback(async () => {
    if (leadId && postalCode) {
      setIsLoading(true);
      const fetchedData = await fetchCarrierAndProductData();
      setCarrierAndProductData(fetchedData);
      setIsLoading(false);
    }
  }, [fetchCarrierAndProductData, leadId, postalCode]);

  useEffect(() => {
    fetchCarrierAndProductCounts();
  }, [fetchCarrierAndProductCounts]);

  let effectiveCarrierCount = DEFAULT_CARRIER_COUNT;
  let effectiveProductCount = DEFAULT_PLAN_COUNT;

  if (countyFips && carrierAndProductData) {
    effectiveCarrierCount =
      carrierAndProductData.carrierCount || DEFAULT_CARRIER_COUNT;
    effectiveProductCount =
      carrierAndProductData.planCount || DEFAULT_PLAN_COUNT;
  }

  const handleCallScriptClick = () => {
    setIsCallScriptModalOpen(true);
  };

  return (
    <WithLoader isLoading={isLoading}>
      <CallScriptModal
        modalOpen={isCallScriptModalOpen}
        handleClose={() => setIsCallScriptModalOpen(false)}
        leadId={leadId}
        countyFips={countyFips}
        postalCode={postalCode}
        carrierAndProductData={carrierAndProductData}
      />
      <div className={styles.cmsContainer}>
        <div className={styles.cmsTitle}>CMS Compliance</div>
        <div className={styles.cmsContent}>
          Please make sure to inform your client that you represent{" "}
          {effectiveCarrierCount} organizations which offer{" "}
          {effectiveProductCount} products in {postalCode}. For the full
          required disclosure, please refer to the{" "}
          <span className={styles.cmsCallLink} onClick={handleCallScriptClick}>
            Call Script
          </span>
        </div>
      </div>
    </WithLoader>
  );
};

CMSCompliance.propTypes = {
  // The ID of the lead
  leadId: PropTypes.string.isRequired,

  // The FIPS code of the county
  countyFips: PropTypes.string.isRequired,

  // The postal code of the location
  postalCode: PropTypes.string.isRequired,

  // Handler for call script click
  onCallScriptClick: PropTypes.func.isRequired,
};

export default CMSCompliance;
