import * as Sentry from '@sentry/react';
import { useCallback, useEffect, useState } from 'react';

import useToast from 'hooks/useToast';
import useUserProfile from 'hooks/useUserProfile';

import { useClientServiceContext } from 'services/clientServiceProvider';

function useAgentPreferencesData() {
  const [isLoading, setIsLoading] = useState(false);
  const [leadPreference, setLeadPreference] = useState({});
  const [agentAvailability, setAgentAvailability] = useState({});
  const { agentId } = useUserProfile();
  const showToast = useToast();
  const { clientsService } = useClientServiceContext();

  const getAgentAccountData = useCallback(async () => {
    if (!agentId) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await clientsService.getAgentAvailability(agentId);
      setLeadPreference(response?.leadPreference);
      setAgentAvailability(response);
      setIsLoading(false);
      return response?.leadPreference;
    } catch (error) {
      setIsLoading(false);
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to load data',
        time: 10000,
      });
    }
  }, [agentId, clientsService, showToast]);

  const updateAgentPreferences = useCallback(
    async payload => {
      try {
        const response = await clientsService.updateAgentPreferences(payload);
        if (response) {
          setLeadPreference(response?.leadPreference);
          setAgentAvailability(response);
          return response?.leadPreference;
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to Save the Preferences.',
          time: 10000,
        });
        Sentry.captureException(error);
      }
    },
    [clientsService, showToast, getAgentAccountData]
  );

  useEffect(() => {
    getAgentAccountData();
  }, [getAgentAccountData]);

  return {
    leadPreference,
    isLoading,
    updateAgentPreferences,
    agentAvailability,
    getAgentAccountData,
    agentId,
  };
}

export default useAgentPreferencesData;
