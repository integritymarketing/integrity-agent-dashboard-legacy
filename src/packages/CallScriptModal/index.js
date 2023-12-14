import { useCallback, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { DEFAULT_EFFECTIVE_YEAR } from "utils/dates";

import useFetch from "hooks/useFetch";
import useAgentPreferencesData from "pages/Account/hooks/useAgentPreferencesData";

import Modal from "components/Modal";
import WithLoader from "components/ui/WithLoader";

import { ModalContent } from "./ModalContent";

const DEFAULT_CARRIER_COUNT = `0-78`;
const DEFAULT_PLAN_COUNT = `0-2,613`;
const LIFE = "LIFE";
const HEALTH = "HEALTH";

export const CallScriptModal = ({ modalOpen, handleClose, leadId, countyFips, postalCode, carrierAndProductData }) => {
    const [carrierProductData, setCarrierProductData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const { leadPreference, isLoading } = useAgentPreferencesData();
    const { Get: fetchCarrierProductData } = useFetch(
        `${process.env.REACT_APP_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}&Year=${DEFAULT_EFFECTIVE_YEAR}`
    );

    const shouldShowOptionalHealthInfo = !carrierProductData && !postalCode && !carrierAndProductData;
    const currentType = leadPreference?.hideLifeQuote ? HEALTH : LIFE;

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

    return (
        <Modal open={modalOpen} onClose={handleClose} title="Recorded Call Script" hideFooter>
            <WithLoader isLoading={isLoadingData || isLoading}>
                <ModalContent
                    carrierCount={carrierCount}
                    productCount={productCount}
                    shouldShowOptionalHealthInfo={shouldShowOptionalHealthInfo}
                    leadPreference={leadPreference}
                    currentType={currentType}
                />
            </WithLoader>
        </Modal>
    );
};

CallScriptModal.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    leadId: PropTypes.string.isRequired,
    countyFips: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    carrierAndProductData: PropTypes.object,
};
