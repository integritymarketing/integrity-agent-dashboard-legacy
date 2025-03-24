import React, { createContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import useFetch from 'hooks/useFetch';
import { LEADS_API_VERSION } from 'services/clientsService';
import useToast from 'hooks/useToast';
import * as Sentry from '@sentry/react';

export const CoverageCalculationsContext = createContext();

export const CoverageCalculationsProvider = ({ children }) => {
  const showToast = useToast();

  const BASE_URL = `${
    import.meta.env.VITE_LEADS_URL
  }/api/${LEADS_API_VERSION}/FinancialNeedsAnalysis`;

  const {
    Get: fetchFinancialNeedsAnalysis,
    loading: isLoadingFinancialNeedsAnalysis,
    data: financialNeedsAnalysis,
  } = useFetch(BASE_URL);

  const {
    Patch: updateFinancialNeedsAnalysisFn,
    loading: isFinancialNeedsAnalysisUpdating,
  } = useFetch(BASE_URL);

  const getFinancialNeedsAnalysis = useCallback(
    async leadId => {
      try {
        await fetchFinancialNeedsAnalysis(null, false, leadId);
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

  const contextValue = useMemo(
    () => ({
      isLoadingFinancialNeedsAnalysis,
      financialNeedsAnalysis,
      getFinancialNeedsAnalysis,
      updateFinancialNeedsAnalysis,
      isFinancialNeedsAnalysisUpdating,
    }),
    [
      isLoadingFinancialNeedsAnalysis,
      financialNeedsAnalysis,
      getFinancialNeedsAnalysis,
      updateFinancialNeedsAnalysis,
      isFinancialNeedsAnalysisUpdating,
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
