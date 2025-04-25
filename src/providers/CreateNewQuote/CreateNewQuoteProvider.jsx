import { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAgentAccountContext } from 'providers/AgentAccountProvider';
import useUserProfile from 'hooks/useUserProfile';
import useToast from 'hooks/useToast';
import { useNavigate, useLocation } from 'react-router-dom';
import useAnalytics from 'hooks/useAnalytics';
import useFetch from 'hooks/useFetch';
import { LIFE_QUESTION_CARD_LIST } from '../../components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants';
import * as Sentry from '@sentry/react';

export const CreateNewQuoteContext = createContext();

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const CreateNewQuoteProvider = ({ children }) => {
  const { updateAgentPreferences, leadPreference } = useAgentAccountContext();
  const { fireEvent } = useAnalytics();
  const { agentId } = useUserProfile();
  const showToast = useToast();
  const navigate = useNavigate();

  const query = useQuery();
  const isQuickQuotePage = query && query.get('quick-quote');

  const LIFE = 'hideLifeQuote';
  const HEALTH = 'hideHealthQuote';

  const IUL_FEATURE_FLAG = import.meta.env.VITE_IUL_FEATURE_FLAG === 'show';

  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [createNewContactModalOpen, setCreateNewContactModalOpen] =
    useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLeadDetails, setNewLeadDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phones: {
      leadPhone: '',
      phoneLabel: '',
    },
    primaryCommunication: '',
  });
  const [showStartQuoteModal, setShowStartQuoteModal] = useState(false);
  const [quoteModalStage, setQuoteModalStage] = useState('');
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedLifeProductType, setSelectedLifeProductType] = useState(null);
  const [selectedHealthProductType, setSelectedHealthProductType] =
    useState(null);
  const [selectedIulGoal, setSelectedIulGoal] = useState(null);
  const [finalExpenseIntakeFormData, setFinalExpenseIntakeFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const [showZipCodeInput, setShowZipCodeInput] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [quickQuoteLeadId, setQuickQuoteLeadId] = useState(null);
  const [quickQuoteLeadDetails, setQuickQuoteLeadDetails] = useState(null);

  const getLeadIdApiUrl = `${
    import.meta.env.VITE_LEADS_URL
  }/api/v2.0/QuickQuote`;

  const { Get: fetchQuickQuoteLeadId, loading: isLoadingGetQuickQuoteLeadId } =
    useFetch(getLeadIdApiUrl);

  const {
    Get: fetchQuickQuoteLeadById,
    Put: updateQuickQuoteLeadDetailsAPICall,
    Post: saveQuickQuoteLeadDetailsAPICall,
    loading: isLoadingQuickQuoteLeadDetails,
  } = useFetch(getLeadIdApiUrl);

  const {
    Post: existingLinkLeadToQuickQuoteAPICall,
    loading: isLoadingExistingLinkLeadToQuickQuote,
  } = useFetch(getLeadIdApiUrl);

  // Define handleClose before any function that references it
  const handleClose = useCallback(() => {
    setQuoteModalStage('');
    setShowStartQuoteModal(false);
    setSelectedLead(null);
    setCreateNewContactModalOpen(false);
    setContactSearchModalOpen(false);
    setDoNotShowAgain(false);
  }, []);

  // Update agent preferences during user selected Do not show again //
  const editAgentPreferences = useCallback(
    async type => {
      try {
        const updatedType = type === 'life' ? HEALTH : LIFE;
        const payload = {
          agentID: agentId,
          leadPreference: {
            ...leadPreference,
            [updatedType]: true,
          },
        };
        await updateAgentPreferences(payload);
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to save the preferences.',
          time: 10000,
        });
      }
    },
    [agentId, leadPreference, showToast, updateAgentPreferences]
  );

  const handleInitiateQuickQuoteLead = useCallback(() => {
    setQuoteModalStage('selectProductTypeCard');

    if (leadPreference?.productClassificationNames?.includes('Life')) {
      setQuoteModalStage('lifeQuestionCard');
    } else if (leadPreference?.productClassificationNames?.includes('Health')) {
      setQuoteModalStage('zipCodeInputCard');
    }
  }, [leadPreference]);

  const showUpArrow = useMemo(() => {
    return (
      leadPreference?.productClassificationNames?.length > 1 ||
      leadPreference?.productClassificationNames?.length === 0
    );
  }, [leadPreference]);

  const handleSelectedProductType = useCallback(
    productType => {
      if (doNotShowAgain) {
        editAgentPreferences(productType);
      }
      setSelectedProductType(productType);
      if (productType === 'life') {
        if (IUL_FEATURE_FLAG) {
          setQuoteModalStage('lifeQuestionCard');
        } else {
          setQuoteModalStage('finalExpenseIntakeFormCard');
        }
      } else {
        const postalCode =
          selectedLead?.addresses?.length > 0
            ? selectedLead?.addresses[0]?.postalCode
            : null;
        const countyDetails =
          selectedLead?.addresses?.length > 0
            ? selectedLead?.addresses[0]?.county
            : null;

        if (postalCode && countyDetails) {
          fireEvent('New Quote Created With Instant Quote', {
            leadId: selectedLead?.leadsId,
            line_of_business: 'Health',
            contactType: newLeadDetails?.firstName
              ? 'New Contact'
              : 'Existing Contact',
          });
          navigate(`/plans/${selectedLead?.leadsId}`);
          handleClose();
        } else {
          setQuoteModalStage('zipCodeInputCard');
        }
      }
    },
    [
      doNotShowAgain,
      editAgentPreferences,
      setSelectedProductType,
      setQuoteModalStage,
      fireEvent,
      navigate,
      handleClose,
      selectedLead,
      IUL_FEATURE_FLAG,
      newLeadDetails,
    ]
  );

  const handleSelectLifeProductType = useCallback(
    productType => {
      setSelectedLifeProductType(productType);
      fireEvent('New Quote Created With Instant Quote', {
        leadId: selectedLead?.leadsId,
        line_of_business: 'Life',
        contactType: newLeadDetails?.firstName
          ? 'New Contact'
          : 'Existing Contact',
      });
      switch (productType) {
        case LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE:
        case LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE:
          setQuoteModalStage('finalExpenseIntakeFormCard');
          break;
        case LIFE_QUESTION_CARD_LIST.INDEXED_UNIVERSAL_LIFE:
          setQuoteModalStage('iulGoalCard');
          break;
        case LIFE_QUESTION_CARD_LIST.TERM_LIFE:
          navigate(`/life/term/${selectedLead.leadsId}/carriers`);
          setShowStartQuoteModal(false);
          break;
        case LIFE_QUESTION_CARD_LIST.GUARANTEED_UL:
          navigate(`/life/gul/${selectedLead.leadsId}/carriers`);
          setShowStartQuoteModal(false);
          break;
        case LIFE_QUESTION_CARD_LIST.ANNUITIES:
          navigate(`/life/annuities/${selectedLead.leadsId}/carriers`);
          break;
        default:
          break;
      }
    },
    [navigate, selectedLead, setSelectedLifeProductType]
  );

  const handleSelectIulGoalType = useCallback(
    productType => {
      setSelectedIulGoal(productType);
      setQuoteModalStage('finalExpenseIntakeFormCard');
    },
    [setSelectedIulGoal, setQuoteModalStage]
  );

  const handleBackFromLifeIntakeForm = useCallback(() => {
    if (
      selectedLifeProductType === LIFE_QUESTION_CARD_LIST.INDEXED_UNIVERSAL_LIFE
    ) {
      setQuoteModalStage('iulGoalCard');
    } else {
      setQuoteModalStage('lifeQuestionCard');
    }
  }, [selectedLifeProductType, setQuoteModalStage]);

  const handleSelectedHealthProductType = useCallback(
    productType => {
      setSelectedHealthProductType(productType);
      const postalCode =
        selectedLead?.addresses?.length > 0
          ? selectedLead?.addresses[0]?.postalCode
          : null;
      const countyDetails =
        selectedLead?.addresses?.length > 0
          ? selectedLead?.addresses[0]?.county
          : null;
      if (postalCode && countyDetails) {
        fireEvent('New Quote Created With Instant Quote', {
          leadId: selectedLead?.leadsId,
          line_of_business: 'Health',
          contactType: newLeadDetails?.firstName
            ? 'New Contact'
            : 'Existing Contact',
        });
        navigate(`/plans/${selectedLead?.leadsId}`);
        handleClose();
      } else {
        setQuoteModalStage('zipCodeInputCard');
      }
    },
    [selectedLead, fireEvent, navigate, newLeadDetails, handleClose]
  );

  const isSimplifiedIUL = useCallback(() => {
    return (
      selectedLifeProductType ===
      LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE
    );
  }, [selectedLifeProductType]);

  const getQuickQuoteLeadId = useCallback(async () => {
    try {
      setShowStartQuoteModal(true);
      const response = await fetchQuickQuoteLeadId();

      if (response) {
        setQuickQuoteLeadDetails(response);
        setQuickQuoteLeadId(response?.leadId);
        if (response?.leadId) {
          handleInitiateQuickQuoteLead();
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to get Quick Quote Lead ID',
        time: 10000,
      });
    }
  }, [fetchQuickQuoteLeadId, showToast]);

  const getQuickQuoteLeadById = useCallback(
    async leadId => {
      if (!leadId) return;
      try {
        const response = await fetchQuickQuoteLeadById(null, false, leadId);

        if (response) {
          setQuickQuoteLeadDetails(response);
          return response;
        }
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to get Quick Quote Lead by ID',
          time: 10000,
        });
      }
    },
    [fetchQuickQuoteLeadById, showToast]
  );

  const saveQuickQuoteLeadDetails = useCallback(
    async payload => {
      try {
        const response = await saveQuickQuoteLeadDetailsAPICall(payload);
        if (response) {
          setQuickQuoteLeadDetails(response);
          fireEvent('New Contact Created With Quick Quote');
          showToast({
            type: 'success',
            message: 'Lead Created successfully',
            time: 10000,
          });
          return response;
        }
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to save Quick Quote Lead details',
          time: 10000,
        });
      }
    },
    [saveQuickQuoteLeadDetailsAPICall, showToast]
  );

  const updateQuickQuoteLeadDetails = useCallback(
    async payload => {
      try {
        const response = await updateQuickQuoteLeadDetailsAPICall(payload);
        if (response) {
          setQuickQuoteLeadDetails(response);
          return response;
        }
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to update Quick Quote Lead details',
          time: 10000,
        });
      }
    },
    [updateQuickQuoteLeadDetailsAPICall, showToast]
  );

  const existingLinkLeadToQuickQuote = useCallback(
    async (payload, leadId) => {
      if (!leadId || !payload) return;
      try {
        const response = await existingLinkLeadToQuickQuoteAPICall(
          payload,
          false,
          leadId
        );
        if (response && response?.leadsId) {
          setQuickQuoteLeadDetails(response);
          return response;
        }
      } catch (error) {
        Sentry.captureException(error);
        showToast({
          type: 'error',
          message: 'Failed to save Quick Quote Lead details',
          time: 10000,
        });
      }
    },
    [existingLinkLeadToQuickQuoteAPICall, showToast]
  );

  return (
    <CreateNewQuoteContext.Provider value={getContextValue()}>
      {children}
    </CreateNewQuoteContext.Provider>
  );

  function getContextValue() {
    return {
      selectedLead,
      newLeadDetails,
      setNewLeadDetails,
      createNewContactModalOpen,
      setCreateNewContactModalOpen,
      contactSearchModalOpen,
      setContactSearchModalOpen,
      selectedProductType,
      setSelectedProductType,
      selectedLifeProductType,
      setSelectedLifeProductType,
      selectedHealthProductType,
      setSelectedHealthProductType,
      selectedIulGoal,
      setSelectedIulGoal,
      finalExpenseIntakeFormData,
      setFinalExpenseIntakeFormData,
      showZipCodeInput,
      setShowZipCodeInput,
      doNotShowAgain,
      setDoNotShowAgain,
      handleSelectedProductType,
      handleSelectLifeProductType,
      handleSelectedHealthProductType,
      editAgentPreferences,
      showStartQuoteModal,
      setShowStartQuoteModal,
      quoteModalStage,
      setQuoteModalStage,
      handleClose,
      showUpArrow,
      IUL_FEATURE_FLAG,
      handleSelectIulGoalType,
      isSimplifiedIUL,
      quickQuoteLeadId,
      getQuickQuoteLeadId,
      updateQuickQuoteLeadDetails,
      isLoadingQuickQuoteLeadDetails,
      getQuickQuoteLeadById,
      quickQuoteLeadDetails,
      setQuickQuoteLeadDetails,
      isLoadingGetQuickQuoteLeadId,
      handleBackFromLifeIntakeForm,
      isQuickQuotePage,
      saveQuickQuoteLeadDetails,
      existingLinkLeadToQuickQuote,
      isLoadingExistingLinkLeadToQuickQuote,
    };
  }
};

CreateNewQuoteProvider.propTypes = {
  children: PropTypes.node.isRequired, // Child components that this provider will wrap
};
