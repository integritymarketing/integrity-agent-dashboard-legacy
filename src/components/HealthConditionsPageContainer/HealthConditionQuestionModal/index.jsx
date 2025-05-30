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
import { UPDATE_CONDITION } from '../HealthConditionContainer.constants';
import { useLeadDetails } from 'providers/ContactDetails';
import useAnalytics from 'hooks/useAnalytics';

function HealthConditionQuestionModal({
  modelHeader,
  onClose,
  selectedCondition,
  contactId,
  onSuccessOfHealthConditionQuestionModal,
  setIsAddNewActivityDialogOpen,
  isSimplifiedIUL = false,
}) {
  const {
    clearConditionalQuestionData,
    updateHealthConditionsQuestionsPost,
    updateHealthConditionsQuestion,
    fetchHealthConditions,
    fetchHealthConditionsQuestionsByCondtionId,
    deleteHealthCondition,
    healthConditions,
  } = useConditions();
  const { leadDetails } = useLeadDetails();
  const { fireEvent } = useAnalytics();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const hasAPICalled = useRef(false);

  const handleCloseModal = () => {
    setValues(null);
    clearConditionalQuestionData();
    onClose();
    fetchHealthConditions(contactId);
  };

  const handleCancelClick = async () => {
    if (
      modelHeader.toLowerCase() === 'search for a condition' ||
      modelHeader.toLowerCase() === 'search for a condition by prescription'
    ) {
      const response = await fetchHealthConditions(contactId);
      const conditionIds = selectedCondition.map(_ => parseInt(_.conditionId));

      const conditions = response.filter(
        _ =>
          conditionIds.includes(parseInt(_.conditionId)) &&
          !_.areUwQuestionsComplete
      );

      const conditionsCompleted = response.filter(
        _ =>
          conditionIds.includes(parseInt(_.conditionId)) &&
          _.areUwQuestionsComplete
      );

      if (conditionsCompleted.length > 0) {
        const flow = isSimplifiedIUL ? 'simplified_iul' : 'final_expense';
        conditionsCompleted.forEach(completed => {
          fireEvent('Health Condition Added', {
            leadid: contactId,
            flow: flow,
            fex_questions_required:
              completed.underwritingQuestionsAnswers.length > 0,
            fex_questions_complete: completed.areUwQuestionsComplete,
          });
        });
      }

      if (conditions.length > 0) {
        await Promise.all(
          conditions.map(async condition => {
            await deleteHealthCondition(contactId, condition.id);
          })
        );
      }
    }
    handleCloseModal();
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

      // Remove duplicate options
      const allOptions = response.flatMap(res => res.options);
      const uniqueOptions = [
        ...new Map(allOptions.map(item => [item.id, item])).values(),
      ];
      setAnswer(response.flatMap(res => res.answers || []));
      setOptions(uniqueOptions);
      setLoading(false);

      if (questions.length === 0) {
        if (setIsAddNewActivityDialogOpen) {
          setIsAddNewActivityDialogOpen(true);
        }
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
      if (answer.length > 0) {
        setValues(answer[0].answers[0]?.answer);
      }
      setCurrentQuestionIndex(0);
    }
  }, [questionData]);

  const getAnswerObject = uwAnswerId => {
    let searchOption = {
      answerId: 0,
      order: 0,
    };

    if (currentQuestion.type !== 'DATE') {
      let optionData = options.find(
        option =>
          option.questionId === currentQuestion.id &&
          option.value == values.toString()
      );
      if (optionData && optionData.id) {
        searchOption.answerId = optionData.id;
        searchOption.order = optionData.order;
      }
    }

    let answered;

    if (
      currentQuestion.type === 'DATE' ||
      currentQuestion.type === 'CHECKBOX'
    ) {
      answered = values;
    } else {
      if (values === 'true') {
        answered = 'true';
      } else {
        answered = 'false';
      }
    }

    const mapQuestionType = {
      RADIO: 'BOOL',
      CHECKBOX: 'STRING',
    };

    if (Array.isArray(values)) {
      return values.map(value => {
        const opt =
          options.find(
            opt => opt.value.toLowerCase() === value.toLowerCase()
          ) || {};

        let uwAnswerIdCheck;
        if (uwAnswerId) {
          const answerResp = answer[currentQuestionIndex]?.answers?.find(
            _ => _.answerId === opt.id
          );
          if (answerResp) {
            uwAnswerIdCheck = answerResp.uwAnswerId;
          } else {
            uwAnswerIdCheck = 0;
          }
        }

        return {
          ...searchOption,
          answerType:
            mapQuestionType[currentQuestion.type] ?? currentQuestion.type,
          answerId: opt.id,
          answer: value,
          order: opt.order,
          uwAnswerId: uwAnswerIdCheck,
          displayText: opt?.displayText,
        };
      });
    }

    let optionData = options.find(
      option =>
        option.questionId === currentQuestion.id &&
        option.order === selectedOption.order
    );

    return [
      {
        answerId: searchOption.answerId,
        answer: answered,
        answerType: optionData?.type ?? currentQuestion.type,
        order: searchOption.order,
        uwAnswerId: uwAnswerId ? uwAnswerId : undefined,
        displayText: optionData?.displayText,
      },
    ];
  };

  const handleApplyClick = async () => {
    try {
      setLoading(true);
      if (values != null) {
        let payload = {
          conditionId: currentQuestion.conditionId,
          uwQuestionId: answer[currentQuestionIndex]?.uwQuestionId || 0,
          underwritingQuestionsAnswers: [
            {
              questionId: currentQuestion.id,
              question: currentQuestion.displayLabel,
              type: currentQuestion.type,
              required: currentQuestion.required,
              answers: getAnswerObject(
                answer[currentQuestionIndex]?.answers[0]?.uwAnswerId || 0
              ),
            },
          ],
        };

        let resp = null;
        if (payload.uwQuestionId) {
          payload.answers = payload.underwritingQuestionsAnswers[0].answers;
          payload.questionId =
            payload.underwritingQuestionsAnswers[0].questionId;
          payload.question = payload.underwritingQuestionsAnswers[0].question;
          delete payload.underwritingQuestionsAnswers;
          resp = await updateHealthConditionsQuestion(payload, contactId);
        } else {
          resp = await updateHealthConditionsQuestionsPost(payload, contactId);
        }

        if (resp) {
          setValues(() => null);
          if (currentQuestionIndex === questionData.length - 1) {
            fireEvent('Health Condition Added', {
              leadid: contactId,
              flow: isSimplifiedIUL ? 'simplified_iul' : 'final_expense',
              fex_questions_required: currentQuestion.required === 'Y',
              fex_questions_complete: values !== null && values !== undefined,
            });

            onSuccessOfHealthConditionQuestionModal();
            handleCloseModal();
          } else {
            setCurrentQuestion(questionData[currentQuestionIndex + 1]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            let prevResponse = null;
            if (answer[currentQuestionIndex + 1]) {
              const ansObj = answer[currentQuestionIndex + 1];
              if (ansObj?.type === 'CHECKBOX') {
                prevResponse = ansObj.answers.map(_ => _.answer.toLowerCase());
              } else {
                prevResponse =
                  answer[currentQuestionIndex + 1].answers[0].answer;
                if (ansObj.type === 'RADIO') {
                  prevResponse = prevResponse;
                }
              }
            }

            setValues(prevResponse);
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

  const handleRemoveClick = async () => {
    await deleteHealthCondition(contactId, selectedCondition[0].id);
    handleCancelClick();
  };

  const isButtonDisabled = useMemo(() => {
    if (loading || !values || values?.length === 0) {
      return true;
    }

    if (currentQuestion.type === 'DATE') {
      const minDate = new Date(leadDetails?.birthdate);
      const selectedDate = new Date(values);
      const maxDate = new Date();

      return selectedDate < minDate || selectedDate > maxDate;
    }

    return false;
  }, [values, loading, currentQuestion, leadDetails]);

  const isLastQuestion = useMemo(() => {
    return currentQuestionIndex === questionData.length - 1;
  }, [currentQuestionIndex, questionData]);

  const applyButtonText = useMemo(() => {
    if (isLastQuestion) {
      return modelHeader === UPDATE_CONDITION
        ? 'Update Condition'
        : 'Add Condition';
    }

    return 'Next';
  }, [isLastQuestion, modelHeader]);

  const currentOptions = useMemo(() => {
    return options
      ?.filter(option => option.questionId === currentQuestion?.id)
      ?.sort((a, b) => a.order - b.order);
  }, [options, currentQuestion]);

  return (
    <Dialog
      open={!!modelHeader}
      onClose={() => {
        handleCancelClick();
      }}
      maxWidth='sm'
    >
      <DialogContent sx={{ padding: 0 }}>
        {currentQuestion && currentQuestion.type && (
          <>
            {currentQuestion.type == 'DATE' && (
              <ConditionalPopupDatePicker
                header={modelHeader}
                title={currentQuestion.conditionName}
                contentHeading={currentQuestion.displayLabel}
                handleApplyClick={handleApplyClick}
                handleCancelClick={handleCancelClick}
                applyButtonDisabled={isButtonDisabled}
                values={values}
                onChange={value => setValues(value)}
                open={!!modelHeader}
                error={error}
                onClose={handleCancelClick}
                applyButtonText={applyButtonText}
                handleRemoveClick={handleRemoveClick}
                showAddIcon={isLastQuestion}
                minDate={
                  leadDetails?.birthdate
                    ? new Date(leadDetails.birthdate)
                    : undefined
                }
              />
            )}
            {currentQuestion.type == 'RADIO' &&
              currentQuestion.tag.trim() !== 'multiple' && (
                <ConditionalPopupYesOrNo
                  header={modelHeader}
                  title={currentQuestion.conditionName}
                  contentHeading={currentQuestion.displayLabel}
                  handleApplyClick={handleApplyClick}
                  handleCancelClick={handleCancelClick}
                  applyButtonDisabled={isButtonDisabled}
                  values={values}
                  onChange={option => {
                    setValues(option?.value);
                    setSelectedOption(option);
                  }}
                  open={!!modelHeader}
                  error={error}
                  onClose={handleCancelClick}
                  applyButtonText={applyButtonText}
                  handleRemoveClick={handleRemoveClick}
                  showAddIcon={isLastQuestion}
                  options={currentOptions}
                />
              )}
            {currentQuestion.type == 'CHECKBOX' && (
              <ConditionalPopupMultiSelect
                header={modelHeader}
                title={currentQuestion.conditionName}
                contentHeading={currentQuestion.displayLabel}
                handleApplyClick={handleApplyClick}
                handleCancelClick={handleCancelClick}
                applyButtonDisabled={isButtonDisabled}
                values={values}
                onChange={value => setValues(value)}
                open={!!modelHeader}
                error={error}
                onClose={handleCancelClick}
                applyButtonText={applyButtonText}
                options={currentOptions}
                setValues={setValues}
                handleRemoveClick={handleRemoveClick}
                showAddIcon={isLastQuestion}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

HealthConditionQuestionModal.propTypes = {
  modelHeader: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCondition: PropTypes.array.isRequired,
  contactId: PropTypes.string.isRequired,
  onSuccessOfHealthConditionQuestionModal: PropTypes.func.isRequired,
  setIsAddNewActivityDialogOpen: PropTypes.func,
};

export default HealthConditionQuestionModal;
