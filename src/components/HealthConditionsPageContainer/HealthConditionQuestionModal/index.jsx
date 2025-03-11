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

function HealthConditionQuestionModal({
  modelHeader,
  onClose,
  selectedCondition,
  contactId,
  onSuccessOfHealthConditionQuestionModal,
}) {
  const {
    clearConditionalQuestionData,
    updateHealthConditionsQuestionsPost,
    updateHealthConditionsQuestion,
    fetchHealthConditions,
    fetchHealthConditionsQuestionsByCondtionId,
    deleteHealthCondition,
  } = useConditions();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState([]);
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
      setAnswer(response.flatMap(res => res.answers || []));
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
      if (values) {
        answered = 'Y';
      } else {
        answered = 'N';
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
        };
      });
    }

    return [
      {
        answerId: searchOption.answerId,
        answer: answered,
        answerType:
          mapQuestionType[currentQuestion.type] ?? currentQuestion.type,
        order: searchOption.order,
        uwAnswerId: uwAnswerId ? uwAnswerId : undefined,
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
            onSuccessOfHealthConditionQuestionModal();
            handleCancelClick();
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
                  prevResponse = prevResponse === 'N' ? false : true;
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

  const isButtonDisabled = useMemo(
    () => loading || values === null || values?.length === 0,
    [values, loading]
  );

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
  }, [currentQuestionIndex, questionData, answer]);

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
              />
            )}
            {currentQuestion.type == 'RADIO' && (
              <ConditionalPopupYesOrNo
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
                options={options.filter(
                  option => option.questionId === currentQuestion.id
                )}
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
  selectedCondition: PropTypes.string.isRequired,
  contactId: PropTypes.string.isRequired,
  onSuccessOfHealthConditionQuestionModal: PropTypes.func.isRequired,
};

export default HealthConditionQuestionModal;
