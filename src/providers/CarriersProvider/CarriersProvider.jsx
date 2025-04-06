import {createContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import useToast from 'hooks/useToast';
import useFetch from 'hooks/useFetch';

export const CarriersContext = createContext();

export const CarriersProvider = ({children}) => {
  const showToast = useToast();

  const URL = `${import.meta.env.VITE_QUOTE_URL}/api/v1.0/Ads`;
  const {Get: fetchCarriers, loading: isLoadingGetCarriers} = useFetch(URL);
  const {Post: AdPolicyRedirectUrl, loading: isLoadingAdPolicyRedirectUrl} = useFetch(URL);

  const getCarriersData = useCallback(
    async type => {
      try {
        const path = `AdPolicyDetails?${type}`;
        const response = await fetchCarriers(null, false, path);
        if (response) {
          return response;
        } else return [];
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to fetch carriers data',
          time: 10000,
        });
      }
    },
    [showToast, fetchCarriers]
  );

  const getAdPolicyRedirectUrl = useCallback(
    async (payload) => {
      try {
        const path = `AdPolicyRedirectUrl`;
        const response = await AdPolicyRedirectUrl(payload, false, path);
        if (response) {
          return response;
        } else return [];
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to fetch Ad Policy details',
          time: 10000,
        });
      }
    },
    [showToast, fetchCarriers]
  );

  return (
    <CarriersContext.Provider value={getContextValue()}>
      {children}
    </CarriersContext.Provider>
  );

  function getContextValue() {
    return {
      getCarriersData,
      isLoadingGetCarriers,
      getAdPolicyRedirectUrl,
      isLoadingAdPolicyRedirectUrl,
    };
  }
};

CarriersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
