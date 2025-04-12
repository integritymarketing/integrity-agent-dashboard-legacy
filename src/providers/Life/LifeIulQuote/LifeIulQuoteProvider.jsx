import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import useFetch from 'hooks/useFetch';
import useToast from 'hooks/useToast';
import PropTypes from 'prop-types';
import removeNullAndEmptyFields from 'utils/removeNullAndEmptyFields';

export const LifeIulQuoteContext = createContext();

export const LifeIulQuoteProvider = ({ children }) => {
  const getLifeIulQuoteUrl = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/v1/IUL/quotes`;
  const applyLifeIulQuoteUrl = `${
    import.meta.env.VITE_ENROLLMENT_API
  }/api/v1.0/IUL/lead`;
  const getLifeIulQuoteDetailsUrl = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/v1.0/IUL/policydetails`;
  const iulQuoteShareUrl = `${import.meta.env.VITE_QUOTE_URL}/api/v1.0/Policy`;

  const ADD_POLICY_REDIRECT_URL = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/v1.0/Ads/AdPolicyRedirectUrl`;

  const showToast = useToast();
  const [lifeIulQuoteResults, setLifeIulQuoteResults] = useState(null);
  const [tempUserDetails, setTempUserDetails] = useState(null);
  const [selectedCarriers, setSelectedCarriers] = useState(['All carriers']);
  const [tabSelected, setTabSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [lifeIulDetails, setLifeIulDetails] = useState(null);
  const [quoteType, setQuoteType] = useState(null);

  const {
    Post: shareIulQuote,
    loading: isLoadingShareIulQuote,
    error: shareIulQuoteError,
  } = useFetch(iulQuoteShareUrl);

  const {
    Post: getLifeIulQuoteResults,
    loading: isLoadingLifeIulQuote,
    error: getLifeIulQuoteError,
  } = useFetch(getLifeIulQuoteUrl);

  const {
    Post: applyLifeIulQuoteDetails,
    loading: isLoadingApplyLifeIulQuote,
    error: getApplyLifeIulQuoteError,
  } = useFetch(applyLifeIulQuoteUrl);

  const {
    Get: getLifeIulQuoteDetails,
    loading: isLoadingLifeIulQuoteDetails,
    error: getLifeIulQuoteDetailsError,
  } = useFetch(getLifeIulQuoteDetailsUrl);

  const {
    Post: fetchAddPolicyRedirectURL,
    loading: isLoadingAddPolicyRedirectURL,
  } = useFetch(ADD_POLICY_REDIRECT_URL);

  const reset = () => {
    setLifeIulQuoteResults(null);
    setTempUserDetails(null);
  };

  const fetchLifeIulQuoteResults = useCallback(
    async reqData => {
      reset();
      const payload = removeNullAndEmptyFields(reqData);

      try {
        const response = await getLifeIulQuoteResults(payload, false);
        if (response && response?.result && response?.result?.length > 0) {
          if (
            !selectedCarriers.includes('All carriers') &&
            selectedCarriers.length > 0
          ) {
            const updatedResults = response.result.filter(result =>
              selectedCarriers.includes(result.companyName)
            );

            setLifeIulQuoteResults(updatedResults);
          } else {
            setLifeIulQuoteResults(response.result);
          }
          setTempUserDetails(response.result);
          setQuoteType(reqData?.quoteType);
          if (reqData?.quoteType === 'IULPROT-SOLVE') {
            const faceAmounts = reqData?.inputs[0]?.faceAmounts;
            const tabSelected = JSON.parse(
              sessionStorage.getItem('iul-protection-tab')
            );
            const initialselectedTab = tabSelected
              ? tabSelected
              : faceAmounts[0];
            handleTabSelection(initialselectedTab, response.result);
          }
          return response;
        } else {
          setLifeIulQuoteResults([]);
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `Failed to get quote`,
        });
        return null;
      }
    },
    [getLifeIulQuoteResults, showToast, sessionStorage]
  );

  const fetchLifeIulQuoteDetails = useCallback(
    async id => {
      try {
        const response = await getLifeIulQuoteDetails(null, false, id);
        if (response) {
          setLifeIulDetails(response);
          return response;
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `Failed to get quote details`,
        });
        return null;
      }
    },
    [getLifeIulQuoteDetails, showToast]
  );

  const handleCarriersChange = value => {
    if (value === 'All carriers') {
      setSelectedCarriers(['All carriers']);
    } else {
      const individualCarriers = selectedCarriers.filter(
        carrier => carrier !== 'All carriers'
      );
      if (individualCarriers?.includes(value)) {
        const updatedCarriers = individualCarriers.filter(
          carrier => carrier !== value
        );
        if (updatedCarriers.length === 0) {
          setSelectedCarriers(['All carriers']);
          setLifeIulQuoteResults(tempUserDetails);
        } else {
          setSelectedCarriers(
            individualCarriers.filter(carrier => carrier !== value)
          );
        }
      } else {
        setSelectedCarriers([...individualCarriers, value]);
      }
    }
  };

  useEffect(() => {
    const list =
      quoteType === 'IULPROT-SOLVE'
        ? tempUserDetails?.filter(
            result => result.input.faceAmount === parseInt(tabSelected)
          )
        : tempUserDetails;
    if (selectedCarriers.includes('All carriers')) {
      setLifeIulQuoteResults(list);
    } else {
      const updatedResults = list?.filter(result =>
        selectedCarriers.includes(result.companyName)
      );
      setLifeIulQuoteResults(updatedResults);
    }
  }, [selectedCarriers]);

  const handleTabSelection = (tab, list) => {
    setTabSelected(tab);
    const updatedResults = list?.filter(
      result => result.input.faceAmount === parseInt(tab)
    );
    setLifeIulQuoteResults(updatedResults);
    if (selectedCarriers.includes('All carriers')) {
      setLifeIulQuoteResults(updatedResults);
    } else {
      const results = updatedResults?.filter(result =>
        selectedCarriers.includes(result.companyName)
      );
      setLifeIulQuoteResults(results);
    }
  };

  const handleComparePlanSelect = plan => {
    const isPlanSelected = selectedPlans?.filter(
      selectedPlan => selectedPlan.recId === plan.recId
    );
    if (isPlanSelected?.length > 0) {
      const updatedPlans = selectedPlans.filter(
        selectedPlan => selectedPlan.recId !== plan.recId
      );
      setSelectedPlans(updatedPlans);
    } else {
      setSelectedPlans([
        ...selectedPlans,
        {
          logo: plan.companyLogoImageUrl,
          name: plan.productName,
          rowId: plan.rowId,
          ...plan,
        },
      ]);
    }
  };

  const handleIULQuoteShareClick = useCallback(
    async (reqData, isCompare) => {
      const path = isCompare ? 'PolicyCompare' : 'SendPolicy';
      try {
        const response = await shareIulQuote(reqData, false, path);
        if (
          response === 'Email Sent' ||
          'SMS Sent' ||
          response?.status === 'Email Sent' ||
          'SMS Sent'
        ) {
          showToast({
            message: 'Successfully shared plan',
          });
        } else {
          showToast({
            type: 'error',
            message: 'Failed to share plan',
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `Failed to get quote details`,
        });
        return null;
      }
    },
    [shareIulQuote, showToast, shareIulQuoteError]
  );

  const handleIULQuoteApplyClick = useCallback(
    async (reqData, leadId) => {
      const payload = removeNullAndEmptyFields(reqData);
      const emailAddress =
        payload?.emails?.length > 0 ? payload.emails[0].leadEmail : null;
      const phoneNumber =
        payload?.phones?.length > 0 ? payload.phones[0].leadPhone : null;
      const obj = {
        enroller: {
          agentLastName: payload?.agentLastName,
          agentFirstName: payload?.agentFirstName,
          agentEmail: payload?.email,
          agentNumber: payload?.agentNPN,
          sourceId: payload?.sourceId || '',
          agentBUs:
            (payload?.assignedBUs &&
              payload?.assignedBUs?.map(bu => bu.buCode)) ||
            [],
        },
        enrollee: {
          firstName: payload?.firstName,
          middleName: payload?.middleName,
          lastName: payload?.lastName,
          gender: payload?.gender?.toLowerCase() === 'male' ? 'M' : 'F',
          dateOfBirth: payload?.birthdate,
          emailAddress,
          phoneNumber,
          address1: payload?.addresses[0]?.address1 || '',
          city: payload?.addresses[0]?.city || '',
          state: reqData?.stateCode || '',
          zipCode: payload?.addresses[0]?.postalCode,
          effectiveDate: new Date(payload?.effectiveDate).toISOString(),
        },
        ssoPrefillFields: {
          product_itmtxt: payload?.ssoPrefillFields.product_itmtxt,
          carrier: payload?.ssoPrefillFields.carrier,
          product: payload?.ssoPrefillFields.product,
          poL_Product: payload?.ssoPrefillFields.poL_Product,
          productType: payload?.ssoPrefillFields.productType,
        },
        productName: payload?.productName,
        carrierUrl: payload?.carrierUrl || '',
        carrierName: payload?.companyName || '',
        planType: 'IUL',
      };

      const response = await applyLifeIulQuoteDetails(obj, false, leadId);
      if (response?.redirectUrl) {
        window.open(response.redirectUrl, '_blank');
      }

      return response;
    },
    [applyLifeIulQuoteDetails]
  );

  const getAddPolicyRedirectURL = useCallback(
    async (agentInformation, leadDetails, planType) => {
      const sessionDetails =
        planType === 'ACCUMULATION'
          ? sessionStorage.getItem('lifeQuoteAccumulationDetails')
          : sessionStorage.getItem('lifeQuoteProtectionDetails');
      const sessionSateCode =
        sessionDetails && JSON.parse(sessionDetails)?.state;
      const payload = {
        ctaName: 'Illustration',
        ctaValue: 'Winflex',
        agent: {
          firstName: agentInformation?.agentFirstName || '',
          lastName: agentInformation?.agentLastName || '',
          email: agentInformation?.email || '',
          phone: agentInformation?.phone || '',
          npn: agentInformation?.agentNPN || '',
          sourceId: agentInformation?.sourceId || '',
          agentBUs:
            (agentInformation?.assignedBUs &&
              agentInformation?.assignedBUs?.map(bu => bu.buCode)) ||
            [],
        },
        lead: {
          leadId: leadDetails?.leadsId || leadDetails?.leadId || null,
          firstName: leadDetails?.firstName || '',
          lastName: leadDetails?.lastName || '',
          email:
            leadDetails?.emails?.length > 0
              ? leadDetails.emails[0].leadEmail
              : null,
          phone:
            leadDetails?.phones?.length > 0
              ? leadDetails.phones[0].leadPhone
              : null,
          age: leadDetails?.age || 0,
          gender: leadDetails?.gender || '',
          dateOfBirth: leadDetails?.birthdate || '',
          stateCode: sessionSateCode || leadDetails?.addresses?.[0]?.stateCode,
        },
      };
      try {
        const response = await fetchAddPolicyRedirectURL(payload);
        if (response?.redirectUrl) {
          window.open(response.redirectUrl, '_blank');
        }
        return response;
      } catch (error) {
        showToast({
          type: 'error',
          message: `Failed to get redirect URL`,
        });
        return null;
      }
    },
    [fetchLifeIulQuoteDetails, showToast]
  );

  const contextValue = useMemo(
    () => ({
      fetchLifeIulQuoteResults,
      isLoadingLifeIulQuote,
      getLifeIulQuoteError,
      lifeIulQuoteResults,
      selectedCarriers,
      handleCarriersChange,
      tempUserDetails,
      handleTabSelection,
      tabSelected,
      setTabSelected,
      showFilters,
      setShowFilters,
      handleComparePlanSelect,
      selectedPlans,
      handleIULQuoteApplyClick,
      isLoadingApplyLifeIulQuote,
      getApplyLifeIulQuoteError,
      fetchLifeIulQuoteDetails,
      isLoadingLifeIulQuoteDetails,
      getLifeIulQuoteDetailsError,
      lifeIulDetails,
      setSelectedPlans,
      handleIULQuoteShareClick,
      isLoadingShareIulQuote,
      getAddPolicyRedirectURL,
      isLoadingAddPolicyRedirectURL,
    }),
    [
      fetchLifeIulQuoteResults,
      isLoadingLifeIulQuote,
      getLifeIulQuoteError,
      lifeIulQuoteResults,
      selectedCarriers,
      handleCarriersChange,
      tempUserDetails,
      handleTabSelection,
      tabSelected,
      setTabSelected,
      showFilters,
      setShowFilters,
      handleComparePlanSelect,
      selectedPlans,
      handleIULQuoteApplyClick,
      isLoadingApplyLifeIulQuote,
      getApplyLifeIulQuoteError,
      fetchLifeIulQuoteDetails,
      isLoadingLifeIulQuoteDetails,
      getLifeIulQuoteDetailsError,
      lifeIulDetails,
      setSelectedPlans,
      handleIULQuoteShareClick,
      isLoadingShareIulQuote,
      getAddPolicyRedirectURL,
      isLoadingAddPolicyRedirectURL,
    ]
  );

  return (
    <LifeIulQuoteContext.Provider value={contextValue}>
      {children}
    </LifeIulQuoteContext.Provider>
  );
};

LifeIulQuoteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
