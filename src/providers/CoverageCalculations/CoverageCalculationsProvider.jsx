import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useFetch from 'hooks/useFetch';
import { LEADS_API_VERSION } from 'services/clientsService';
import useToast from 'hooks/useToast';
import * as Sentry from '@sentry/react';

export const CoverageCalculationsContext = createContext();

export const CoverageCalculationsProvider = ({ children }) => {
  const showToast = useToast();
  const [financialNeedsAnalysis, setFinancialNeedsAnalysis] = useState(null);

  const BASE_URL = `${
    import.meta.env.VITE_LEADS_URL
  }/api/${LEADS_API_VERSION}/FinancialNeedsAnalysis`;

  const {
    Get: fetchFinancialNeedsAnalysis,
    loading: isLoadingFinancialNeedsAnalysis,
  } = useFetch(BASE_URL);

  const {
    Patch: updateFinancialNeedsAnalysisFn,
    loading: isFinancialNeedsAnalysisUpdating,
  } = useFetch(BASE_URL);

  const { Post: sendDetails, loading: isSendFNADetailsPosting } = useFetch(
    `${BASE_URL}/Send`
  );

  const getFinancialNeedsAnalysis = useCallback(
    async leadId => {
      try {
        const response = await fetchFinancialNeedsAnalysis(null, false, leadId);
        setFinancialNeedsAnalysis(response);
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to fetch the financial needs analysis',
        });
      }
    },
    [fetchFinancialNeedsAnalysis, showToast]
  );

  const updateFinancialNeedsAnalysis = useCallback(async (leadId, body) => {
    try {
      const response = await updateFinancialNeedsAnalysisFn(
        body,
        false,
        leadId
      );
      if ('errors' in response) {
        showToast({
          type: 'error',
          message: 'Failed to update the financial needs analysis',
        });
        return false;
      }

      setFinancialNeedsAnalysis(response);

      showToast({
        type: 'success',
        message: 'Updated the financial needs analysis data successfully',
      });
      return true;
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to update the financial needs analysis',
      });
    }
  }, []);

  const sendFNADetails = useCallback(async body => {
    try {
      await sendDetails(body, false, null);
      showToast({
        type: 'success',
        message: 'Shared Successfully',
      });
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to send the details',
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      isLoadingFinancialNeedsAnalysis,
      financialNeedsAnalysis,
      getFinancialNeedsAnalysis,
      updateFinancialNeedsAnalysis,
      isFinancialNeedsAnalysisUpdating,
      sendFNADetails,
      isSendFNADetailsPosting,
      setFinancialNeedsAnalysis,
    }),
    [
      isLoadingFinancialNeedsAnalysis,
      financialNeedsAnalysis,
      getFinancialNeedsAnalysis,
      updateFinancialNeedsAnalysis,
      isFinancialNeedsAnalysisUpdating,
      sendFNADetails,
      isSendFNADetailsPosting,
      setFinancialNeedsAnalysis,
    ]
  );

  return (
    <CoverageCalculationsContext.Provider value={contextValue}>
      {children}
    </CoverageCalculationsContext.Provider>
  );
};

CoverageCalculationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
