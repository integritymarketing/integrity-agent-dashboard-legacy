import { createContext, useCallback, useState, useMemo } from 'react';

import * as Sentry from '@sentry/react';
import useToast from 'hooks/useToast';
import useUserProfile from 'hooks/useUserProfile';
import PropTypes from 'prop-types';
import useFetch from 'hooks/useFetch';

// Create a context for Agent Profile
export const ProfessionalProfileContext = createContext();

/**
 * Provider component to manage agent profile state and actions.
 * @param {object} props - React children nodes
 */
export const ProfessionalProfileProvider = ({ children }) => {
  // Retrieve the agentId from the user profile
  const { agentId, npn } = useUserProfile();

  // Hook for displaying toast notifications
  const showToast = useToast();

  // Axios hooks for API calls

  const AGENTS_URL = `${
    import.meta.env.VITE_AGENTS_URL
  }/api/v1.0/Agents/${agentId}`;
  const PROFESSIONAL_URL = `${
    import.meta.env.VITE_AGENTS_URL
  }/api/v1.0/AgentProfessionalInfo/${npn}`;
  const AGENTS_AVAILABLE_URL = `${
    import.meta.env.VITE_AGENTS_URL
  }/api/v1.0/AgentMobile/Available/${agentId}`;

  const { Get: fetchAgentProfileData, loading: fetchAgentProfileDataLoading } =
    useFetch(AGENTS_URL);

  const {
    Get: fetchAgentProfessionalInfo,
    loading: fetchAgentProfessionalInfoLoading,
  } = useFetch(PROFESSIONAL_URL);

  const { Get: fetchAgentData, loading: fetchAgentDataLoading } =
    useFetch(AGENTS_AVAILABLE_URL);

  // State for storing agent preferences and availability
  const [profileInfo, setProfileInfo] = useState(null);
  const [agentData, setAgentData] = useState(null);

  const getAgentProfessionalInfo = useCallback(async () => {
    if (!npn) {
      return null;
    }
    try {
      const response = await fetchAgentProfessionalInfo();
      if (response) {
        return response;
      }
      return null;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  }, [npn, fetchAgentProfessionalInfo, showToast]);

  const getAgentProfileData = useCallback(async () => {
    if (!agentId) {
      return;
    }
    try {
      const response = await fetchAgentProfileData();

      if (response) {
        setProfileInfo(response || {});
      }
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to load data',
        time: 10000,
      });
    }
  }, [fetchAgentProfileData, showToast, agentId]);

  /**
   * Fetch agent account data and update state.
   */
  const getAgentData = useCallback(async () => {
    if (!agentId) return null;
    try {
      const response = await fetchAgentData();
      if (response) {
        setAgentData(response || {});
      }
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to load data',
        time: 5000,
      });
    }
  }, [agentId, fetchAgentData, showToast]);

  // Memoize context value to optimize re-renders
  const contextValue = useMemo(
    () => ({
      profileInfo,
      getAgentProfileData,
      fetchAgentProfileDataLoading,
      getAgentProfessionalInfo,
      fetchAgentProfessionalInfoLoading,
      getAgentData,
      fetchAgentDataLoading,
      agentData,
    }),
    [
      profileInfo,
      getAgentProfileData,
      fetchAgentProfileDataLoading,
      getAgentProfessionalInfo,
      fetchAgentProfessionalInfoLoading,
      getAgentData,
      fetchAgentDataLoading,
      agentData,
    ]
  );

  // Provide the context value to children
  return (
    <ProfessionalProfileContext.Provider value={contextValue}>
      {children}
    </ProfessionalProfileContext.Provider>
  );
};

ProfessionalProfileProvider.propTypes = {
  /** React children nodes */
  children: PropTypes.node.isRequired,
};
