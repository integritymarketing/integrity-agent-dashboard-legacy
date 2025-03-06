import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import ConditionalPopupDatePicker from 'components/ui/ConditionalPopup/ConditionalPopupDatePicker';
import ConditionalPopupYesOrNo from 'components/ui/ConditionalPopup/ConditionalPopupYesOrNo';
import { useConditions } from 'providers/Conditions';
import { Dialog, DialogContent } from '@mui/material';
import ConditionalPopupMultiSelect from 'components/ui/ConditionalPopup/ConditionPopupMultiSelect';

function HealthConditionQuestionModal({
  open,
  onClose,
  selectedCondition,
  contactId,
  onSuccessOfHealthConditionQuestionModal,
}) {
  const {
    clearConditionalQuestionData,
    updateHealthConditionsQuestionsPost,
    fetchHealthConditions,
    fetchHealthConditionsQuestionsByCondtionId,
  } = useConditions();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState();
  const hasAPICalled = useRef(false);

  const handleCancelClick = () => {
    setValues(null);
    clearConditionalQuestionData();
    onClose();
    fetchHealthConditions(contactId);
  };

  const fetchAllConditionsQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const promises = selectedCondition.map(_ => {
        return fetchHealthConditionsQuestionsByCondtionId(
          contactId,
          _.conditionId
        );
      });
      const response = await Promise.all(promises);

      const questions = response
        .filter(res => Boolean(res))
        .flatMap((conditionResponse, index) =>
          conditionResponse.questions.items.map(question => ({
            ...question,
            conditionId: selectedCondition[index].conditionId,
            conditionName: selectedCondition[index].conditionName,
          }))
        );
      setOptions(response.flatMap(res => res.options));
      setLoading(false);
      if (questions.length === 0) {
        handleCancelClick();
      } else {
        setQuestionData(questions);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [
    selectedCondition,
    fetchHealthConditionsQuestionsByCondtionId,
    contactId,
  ]);

  useEffect(() => {
    if (hasAPICalled.current) {
      return;
    }
    hasAPICalled.current = true;
    fetchAllConditionsQuestions();
  }, []);

  useEffect(() => {
    if (questionData.length > 0) {
      setCurrentQuestion(questionData[0]);
      setCurrentQuestionIndex(0);
    }
  }, [questionData]);

  const handleApplyClick = async () => {
    try {
      setLoading(true);
      if (values != null) {
        let payload = {
          conditionId: currentQuestion.conditionId,
          underwritingQuestionsAnswers: [
            {
              uwQuestionId: 0,
              conditionId: currentQuestion.conditionId,
              questionId: currentQuestion.id,
              question: currentQuestion.displayLabel,
              answer:
                currentQuestion.type === 'DATE' ||
                currentQuestion.type === 'CHECKBOX'
                  ? values
                  : values
                  ? 'Y'
                  : 'N',
              type: currentQuestion.type,
              required: currentQuestion.required,
              orderBy: 0,
            },
          ],
        };

        const resp = await updateHealthConditionsQuestionsPost(
          payload,
          contactId
        );
        if (resp) {
          if (currentQuestionIndex === questionData.length - 1) {
            onSuccessOfHealthConditionQuestionModal();
            handleCancelClick();
          } else {
            setCurrentQuestion(questionData[currentQuestionIndex + 1]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setValues(null);
          }
        }
      } else {
        setError('Please select an answer');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = useMemo(
    () => loading || values === null,
    [values, loading]
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleCancelClick;
      }}
      maxWidth='sm'
    >
      <DialogContent sx={{ padding: 0 }}>
        {currentQuestion && currentQuestion.type && (
          <>
            {currentQuestion.type == 'DATE' && (
              <ConditionalPopupDatePicker
                header='Search for a Condition'
                title={currentQuestion.conditionName}
                contentHeading={currentQuestion.displayLabel}
                handleApplyClick={handleApplyClick}
                handleCancelClick={handleCancelClick}
                applyButtonDisabled={isButtonDisabled}
                values={values}
                onChange={value => setValues(value)}
                open={open}
                error={error}
                onClose={handleCancelClick}
                applyButtonText={
                  currentQuestionIndex === questionData.length - 1
                    ? 'Add Condition'
                    : 'Next'
                }
              />
            )}
            {currentQuestion.type == 'RADIO' && (
              <ConditionalPopupYesOrNo
                header='Search for a Condition by Prescription'
                title={currentQuestion.conditionName}
                contentHeading={currentQuestion.displayLabel}
                handleApplyClick={handleApplyClick}
                handleCancelClick={handleCancelClick}
                applyButtonDisabled={isButtonDisabled}
                values={values}
                onChange={value => setValues(value)}
                open={open}
                error={error}
                onClose={handleCancelClick}
                applyButtonText={
                  currentQuestionIndex === questionData.length - 1
                    ? 'Add Condition'
                    : 'Next'
                }
              />
            )}
            {currentQuestion.type == 'CHECKBOX' && (
              <ConditionalPopupMultiSelect
                header='Search for a Condition by Prescription'
                title={currentQuestion.conditionName}
                contentHeading={currentQuestion.displayLabel}
                handleApplyClick={handleApplyClick}
                handleCancelClick={handleCancelClick}
                applyButtonDisabled={isButtonDisabled}
                values={values}
                onChange={value => setValues(value)}
                open={open}
                error={error}
                onClose={handleCancelClick}
                applyButtonText={
                  currentQuestionIndex === questionData.length - 1
                    ? 'Add Condition'
                    : 'Next'
                }
                options={options.filter(
                  option => option.questionId === currentQuestion.id
                )}
                setValues={setValues}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

HealthConditionQuestionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCondition: PropTypes.string.isRequired,
  contactId: PropTypes.string.isRequired,
  onSuccessOfHealthConditionQuestionModal: PropTypes.func.isRequired,
};

export default HealthConditionQuestionModal;
