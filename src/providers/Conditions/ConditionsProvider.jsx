import {
  SEARCH_BY_PRESCRIPTION,
  UPDATE_CONDITION,
} from 'components/HealthConditionsPageContainer/HealthConditionContainer.constants';
import useFetch from 'hooks/useFetch';
import useToast from 'hooks/useToast';
import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';
import { QUOTES_API_VERSION } from 'services/clientsService';
import performAsyncOperation from 'utilities/performAsyncOperation';
import * as Sentry from '@sentry/react';

export const ConditionsContext = createContext();

export const ConditionsProvider = ({ children }) => {
  const URL_V3 = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/Underwriting/medication/search`;
  const URL_V4 = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/search`;
  const HEALTH_CONDITION_QUESTIONS_URL = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/questions`;
  const POST_HEALTH_CONDITIONS = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/HealthCondition/Lead/SaveMultiple`;
  const GET_HEALTH_CONDITIONS = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/HealthCondition/Lead`;
  const DELETE_HEALTH_CONDITION_QUESTION = `${
    import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/HealthCondition/Lead`;

  const {
    Get: searchHealthConditions,
    loading: searchHealthConditionsLoading,
  } = useFetch(URL_V3);
  const {
    Get: getPrescriptionConditions,
    loading: getPrescriptionConditionsLoading,
  } = useFetch(URL_V4);
  const { Post: postHealthConditions, loading: postHealthConditionsLoading } =
    useFetch(POST_HEALTH_CONDITIONS);
  const {
    Get: getHealthConditionsQuestions,
    loading: getHealthConditionsQuestionsLoading,
    data: getHealthConditionsQuestionsData,
  } = useFetch(HEALTH_CONDITION_QUESTIONS_URL);
  const {
    Patch: updateHealthConditionsQuestions,
    loading: updateHealthConditionsQuestionsLoading,
  } = useFetch(HEALTH_CONDITION_QUESTIONS_URL);
  const {
    Post: updateHealthConditionsQuestionsPostCall,
    isLoading: updateHealthConditionsQuestionsPostCallLoading,
  } = useFetch(HEALTH_CONDITION_QUESTIONS_URL);
  const { Get: getHealthConditions, loading: getHealthConditionsLoading } =
    useFetch(GET_HEALTH_CONDITIONS);
  const {
    Get: getQuestionsByConditionIdAndLeadId,
    loading: getQuestionsByConditionIdAndLeadIdLoading,
    data: getQuestionsByConditionIdAndLeadIdData,
  } = useFetch(HEALTH_CONDITION_QUESTIONS_URL);

  const {
    Delete: deleteHealthConditionByConditionId,
    loading: isHealthConditionInProgress,
  } = useFetch(DELETE_HEALTH_CONDITION_QUESTION);

  const [prescriptionConditions, setPrescriptionConditions] = useState([]);
  const [healthConditionsQuestions, setHealthConditionsQuestions] = useState(
    []
  );
  const [healthConditions, setHealthConditions] = useState([]);
  const [selectedConditionForEdit, setSelectedConditionForEdit] =
    useState(null);
  const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] =
    useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [openAddPrescriptionModal, setOpenAddPrescriptionModal] =
    useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [openQuestionModal, setOpenQuestionModal] = useState(null);
  const [isConditionAddedAlready, setIsConditionAddedAlready] = useState(false);

  const showToast = useToast();

  const deleteHealthCondition = useCallback(async (leadId, conditionId) => {
    try {
      const path = `${leadId}/id/${conditionId}`;
      await deleteHealthConditionByConditionId(null, false, path);
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'Failed to delete health conditions',
      });
    }
  }, []);

  const fetchHealthConditions = useCallback(
    async leadId => {
      try {
        const path = `${leadId}`;
        const data = await getHealthConditions(null, false, path);

        setHealthConditions(data);
        return data;
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to search health conditions',
        });
      }
    },
    [getHealthConditions]
  );

  const fetchSearchHealthConditions = useCallback(
    async healthCondition => {
      try {
        const path = `${encodeURIComponent(healthCondition)}`;
        return await searchHealthConditions(null, false, path);
      } catch (error) {
        console.log('error', error);
        showToast({
          type: 'error',
          message: 'Failed to search health conditions',
        });
      }
    },
    [searchHealthConditions, showToast]
  );

  const fetchPrescriptionConditions = useCallback(
    async prescription => {
      try {
        let path;
        if (selectedPrescription && selectedPrescription.dosage) {
          path = `MED/NDC11/${encodeURIComponent(prescription)}`;
        } else {
          path = `MED/TERM/${encodeURIComponent(prescription)}`;
        }
        const data = await getPrescriptionConditions(null, false, path);
        setPrescriptionConditions(data?.uwConditions || []);
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to get the prescription conditions',
        });
      }
    },
    [getPrescriptionConditions, showToast, selectedPrescription]
  );

  const addHealthConditions = useCallback(
    async (healthConditions, leadId) => {
      if (!leadId) {
        return;
      }
      await performAsyncOperation(
        () => postHealthConditions(healthConditions, false, leadId),
        () => {},
        async () => {
          showToast({ message: 'Health Conditions Applied' });
          //await fetchHealthConditionsQuestions(leadId);
        }
      );
    },
    [postHealthConditions, showToast]
  );

  const fetchHealthConditionsQuestions = useCallback(
    async leadId => {
      try {
        const path = `${leadId}`;
        let data = await getHealthConditionsQuestions(null, false, path);
        setHealthConditionsQuestions(data);
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to get the health conditions questions',
        });
        setOpenQuestionModal(SEARCH_BY_PRESCRIPTION);
        fetchHealthConditions(leadId);
      }
    },
    [getHealthConditionsQuestions, showToast]
  );

  const fetchHealthConditionsQuestionsByCondtionId = useCallback(
    async (leadId, conditionId) => {
      try {
        const path = `${leadId}/condition/${conditionId}`;
        const data = await getHealthConditionsQuestions(null, false, path);
        setHealthConditionsQuestions(data);
        return data;
      } catch (error) {
        showToast({
          type: 'error',
          message: 'Failed to get the health conditions questions',
        });
      }
    },
    []
  );

  const updateHealthConditionsQuestion = useCallback(
    async (payload, leadId) => {
      try {
        let path = `${leadId}`;
        return await updateHealthConditionsQuestions(payload, false, path);
      } catch (error) {
        console.log('error', error);
        showToast({
          type: 'error',
          message: 'Failed to update the health conditions questions',
        });
      }
    },
    [updateHealthConditionsQuestions, showToast]
  );

  const updateHealthConditionsQuestionsPost = useCallback(
    async (payload, leadId) => {
      try {
        let path = `${leadId}`;
        return await updateHealthConditionsQuestionsPostCall(
          payload,
          false,
          path
        );
      } catch (error) {
        console.log('error', error);
        showToast({
          type: 'error',
          message: 'Failed to update the health conditions questions',
        });
      }
    },
    [updateHealthConditionsQuestionsPostCall, showToast]
  );

  const fetchQuestionsByConditionIdAndLeadId = useCallback(
    async (conditionId, leadId) => {
      try {
        const path = `${leadId}/condition/${conditionId}`;
        return await getQuestionsByConditionIdAndLeadId(null, false, path);
      } catch (error) {
        console.log('error', error);
        showToast({
          type: 'error',
          message: 'Failed to get the health conditions questions',
        });
      }
    },
    [getQuestionsByConditionIdAndLeadId, showToast]
  );

  const handleHealthConditionClose = useCallback(() => {
    setPrescriptionConditions([]);
  }, []);

  const clearConditionalQuestionData = useCallback(() => {
    setHealthConditionsQuestions([]);
  }, []);

  const handleOnClose = useCallback(() => {
    setIsAddNewActivityDialogOpen(false);
    setSelectedConditionForEdit(null);
  }, []);

  const handleOnEdit = useCallback(
    async (condition, leadId) => {
      try {
        const questions = await fetchQuestionsByConditionIdAndLeadId(
          condition.conditionId,
          leadId
        );
        if (questions.questions.items.length > 0) {
          setHealthConditionsQuestions([questions]);

          handleApplyClickOfAddPrescriptionModal(
            [{ ...condition }],
            UPDATE_CONDITION
          );
        } else {
          setSelectedConditionForEdit(condition);
          setIsAddNewActivityDialogOpen(true);
        }
      } catch (error) {
        console.log('error', error);
        setSelectedConditionForEdit(condition);
        setIsAddNewActivityDialogOpen(true);
      }
    },
    [fetchQuestionsByConditionIdAndLeadId, showToast]
  );

  const handlePrescriptionClick = useCallback(prescription => {
    setSelectedPrescription(prescription);
    setOpenAddPrescriptionModal(true);
  }, []);

  const handleApplyClickOfAddPrescriptionModal = useCallback(
    (value, modelHeader) => {
      setSelectedCondition(value);
      setOpenAddPrescriptionModal(false);
      setOpenQuestionModal(modelHeader);
    },
    []
  );

  const handleCloseQuestionModal = useCallback(() => {
    setOpenQuestionModal(null);
    setSelectedCondition(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      fetchSearchHealthConditions,
      searchHealthConditionsLoading,
      fetchPrescriptionConditions,
      getPrescriptionConditionsLoading,
      prescriptionConditions,
      addHealthConditions,
      handleHealthConditionClose,
      healthConditionsQuestions,
      clearConditionalQuestionData,
      updateHealthConditionsQuestion,
      updateHealthConditionsQuestionsLoading,
      getHealthConditionsQuestionsLoading,
      fetchHealthConditions,
      getHealthConditionsLoading,
      updateHealthConditionsQuestionsPost,
      updateHealthConditionsQuestionsPostCallLoading,
      postHealthConditionsLoading,
      fetchQuestionsByConditionIdAndLeadId,
      getQuestionsByConditionIdAndLeadIdLoading,
      getQuestionsByConditionIdAndLeadIdData,
      healthConditions,
      setHealthConditions,
      selectedConditionForEdit,
      setSelectedConditionForEdit,
      isAddNewActivityDialogOpen,
      setIsAddNewActivityDialogOpen,
      handleOnClose,
      handleOnEdit,
      selectedPrescription,
      setSelectedPrescription,
      openAddPrescriptionModal,
      setOpenAddPrescriptionModal,
      prescriptionDetails,
      setPrescriptionDetails,
      selectedCondition,
      setSelectedCondition,
      openQuestionModal,
      setOpenQuestionModal,
      handlePrescriptionClick,
      handleApplyClickOfAddPrescriptionModal,
      handleCloseQuestionModal,
      fetchHealthConditionsQuestionsByCondtionId,
      getHealthConditionsQuestionsData,
      deleteHealthCondition,
      isConditionAddedAlready,
      setIsConditionAddedAlready,
    }),
    [
      fetchSearchHealthConditions,
      searchHealthConditionsLoading,
      fetchPrescriptionConditions,
      getPrescriptionConditionsLoading,
      prescriptionConditions,
      addHealthConditions,
      handleHealthConditionClose,
      healthConditionsQuestions,
      clearConditionalQuestionData,
      updateHealthConditionsQuestion,
      updateHealthConditionsQuestionsLoading,
      getHealthConditionsQuestionsLoading,
      fetchHealthConditions,
      getHealthConditionsLoading,
      updateHealthConditionsQuestionsPost,
      updateHealthConditionsQuestionsPostCallLoading,
      postHealthConditionsLoading,
      fetchQuestionsByConditionIdAndLeadId,
      getQuestionsByConditionIdAndLeadIdLoading,
      getQuestionsByConditionIdAndLeadIdData,
      healthConditions,
      selectedConditionForEdit,
      isAddNewActivityDialogOpen,
      handleOnClose,
      handleOnEdit,
      selectedPrescription,
      openAddPrescriptionModal,
      prescriptionDetails,
      selectedCondition,
      openQuestionModal,
      handlePrescriptionClick,
      handleApplyClickOfAddPrescriptionModal,
      handleCloseQuestionModal,
      fetchHealthConditionsQuestionsByCondtionId,
      getHealthConditionsQuestionsData,
      deleteHealthCondition,
      isConditionAddedAlready,
      setIsConditionAddedAlready,
    ]
  );
  return (
    <ConditionsContext.Provider value={contextValue}>
      {children}
    </ConditionsContext.Provider>
  );
};

ConditionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
