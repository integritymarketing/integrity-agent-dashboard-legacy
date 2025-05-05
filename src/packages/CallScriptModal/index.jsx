import { useCallback, useEffect, useState, useMemo } from 'react';

import PropTypes from 'prop-types';
import { useAgentAccountContext } from 'providers/AgentAccountProvider';

import { DEFAULT_EFFECTIVE_YEAR } from 'utils/dates';

import useFetch from 'hooks/useFetch';
import useCallRecordings from 'hooks/useCallRecordings';

import Modal from 'components/Modal';
import WithLoader from 'components/ui/WithLoader';

import { ModalContent } from './ModalContent';
import { CallSourceModalContent } from './CallSourceModalContent';
import useAgentInformationByID from 'hooks/useAgentInformationByID';

const DEFAULT_CARRIER_COUNT = `0-78`;
const DEFAULT_PLAN_COUNT = `0-2,613`;
const LIFE = 'LIFE';
const HEALTH = 'HEALTH';
const IN_PROGRESS = 'in-progress';
const VALID_CALL_SOURCES = [
  'SilverSneakers PlanEnroll (Realtime Call)',
  'inperson',
  'PlanEnroll Final Expense (Realtime Call)',
  'PlanEnroll (Realtime Call)',
];

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
  const { leadPreference } = useAgentAccountContext();
  const callRecordings = useCallRecordings();
  const { agentInformation } = useAgentInformationByID();

  const isCallInProgress = useMemo(
    () => callRecordings.find(record => record.callStatus === IN_PROGRESS),
    [callRecordings]
  );
  const hasCallSource = isCallInProgress?.callSource;
  const isValidCallSource =
    hasCallSource && VALID_CALL_SOURCES.includes(hasCallSource);
  const isPlanEnrollFinalExpense =
    hasCallSource === 'PlanEnroll Final Expense (Realtime Call)';
  const { Get: fetchCarrierProductData } = useFetch(
    `${
      import.meta.env.VITE_QUOTE_URL
    }/api/v2.0/Lead/${leadId}/Plan/Carrier/Count?Zip=${postalCode}&Fips=${countyFips}&Year=${DEFAULT_EFFECTIVE_YEAR}`
  );

  const shouldShowOptionalHealthInfo =
    !carrierProductData && !postalCode && !carrierAndProductData;

  const currentType = useMemo(() => {
    if (
      leadPreference?.productClassificationNames?.includes('Life') &&
      leadPreference?.productClassificationNames?.length === 1
    ) {
      return LIFE;
    } else if (leadPreference?.productClassificationNames?.includes('Health')) {
      return HEALTH;
    } else {
      return localStorage.getItem('currentType') ?? HEALTH;
    }
  }, [leadPreference]);

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

  const handleClearAndClose = useCallback(() => {
    localStorage.removeItem('currentType');
    handleClose();
  }, [handleClose]);

  return (
    <Modal
      open={modalOpen}
      onClose={handleClearAndClose}
      title='Recorded Call Script'
      hideFooter
    >
      <WithLoader isLoading={isLoadingData}>
        {!isValidCallSource ? (
          <ModalContent
            carrierCount={carrierCount}
            productCount={productCount}
            shouldShowOptionalHealthInfo={shouldShowOptionalHealthInfo}
            leadPreference={leadPreference}
            currentType={currentType}
            leadId={leadId}
          />
        ) : (
          <CallSourceModalContent
            carrierCount={carrierCount}
            productCount={productCount}
            shouldShowOptionalHealthInfo={shouldShowOptionalHealthInfo}
            leadPreference={leadPreference}
            currentType={currentType}
            leadId={leadId}
            agentInformation={agentInformation}
            showOnlyLife={isPlanEnrollFinalExpense}
          />
        )}
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
