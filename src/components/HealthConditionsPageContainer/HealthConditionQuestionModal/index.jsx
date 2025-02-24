import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConditionalPopupDatePicker from "components/ui/ConditionalPopup/ConditionalPopupDatePicker";
import ConditionalPopupYesOrNo from "components/ui/ConditionalPopup/ConditionalPopupYesOrNo";
import { useConditions } from "providers/Conditions";
import { Dialog, DialogContent } from "@mui/material";

function HealthConditionQuestionModal({ open, onClose, selectedCondition, contactId }) {
    const { healthConditionsQuestions, clearConditionalQuestionData, updateHealthConditionsQuestionsPost } =
        useConditions();

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [questionData, setQuestionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (healthConditionsQuestions.length > 0 && selectedCondition.length > 0) {
            let tempQuestionData = [];
            healthConditionsQuestions.slice(0, selectedCondition.length).forEach((element, index) => {
                tempQuestionData = element.questions.items.reduce((acc, item) => {
                    acc.push({
                        ...item,
                        conditionId: selectedCondition[index].conditionId,
                        conditionName: selectedCondition[index].conditionName,
                    });
                    return acc;
                }, []);
            });

            console.log(tempQuestionData);
            setQuestionData(tempQuestionData);
        }
    }, [healthConditionsQuestions, selectedCondition]);

    useEffect(() => {
        if (questionData.length > 0) {
            setCurrentQuestion(questionData[0]);
            setCurrentQuestionIndex(0);
        }
    }, [questionData]);

    const handleApplyClick = async () => {
        try {
            if (values) {
                let payload = {
                    conditionId: currentQuestion.conditionId,
                    underwritingQuestionsAnswers: [
                        {
                            uwQuestionId: 0,
                            conditionId: currentQuestion.conditionId,
                            questionId: currentQuestion.id,
                            question: currentQuestion.displayLabel,
                            answer: currentQuestion.type === "DATE" ? values : values ? "Y" : "N",
                            type: currentQuestion.type,
                            required: currentQuestion.required,
                            orderBy: 0,
                        },
                    ],
                };

                await updateHealthConditionsQuestionsPost(payload, contactId);
                setCurrentQuestion(questionData[currentQuestionIndex + 1]);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setValues(null);
            } else {
                setError("Please select an answer");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleCancelClick = () => {
        setValues(null);
        clearConditionalQuestionData();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleCancelClick;
            }}
            maxWidth="sm"
        >
            <DialogContent sx={{ padding: 0 }}>
                {currentQuestion && currentQuestion.type && (
                    <>
                        {currentQuestion.type == "DATE" ? (
                            <ConditionalPopupDatePicker
                                header={"Search for a Condition by Prescription"}
                                title={currentQuestion.conditionName}
                                contentHeading={currentQuestion.displayLabel}
                                handleApplyClick={handleApplyClick}
                                handleCancelClick={handleCancelClick}
                                applyButtonDisabled={loading}
                                values={values}
                                onChange={(value) => setValues(value)}
                                open={open}
                                error={error}
                                onClose={handleCancelClick}
                                applyButtonText={
                                    currentQuestionIndex === questionData.length - 1 ? "Add Condition" : "Next"
                                }
                            />
                        ) : (
                            <ConditionalPopupYesOrNo
                                header={"Search for a Condition by Prescription"}
                                title={currentQuestion.conditionName}
                                contentHeading={currentQuestion.displayLabel}
                                handleApplyClick={handleApplyClick}
                                handleCancelClick={handleCancelClick}
                                applyButtonDisabled={loading}
                                values={values}
                                onChange={(value) => setValues(value)}
                                open={open}
                                error={error}
                                onClose={handleCancelClick}
                                applyButtonText={
                                    currentQuestionIndex === questionData.length - 1 ? "Add Condition" : "Next"
                                }
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
    question: PropTypes.string.isRequired,
    selectedCondition: PropTypes.string.isRequired,
    contactId: PropTypes.string.isRequired,
};

export default HealthConditionQuestionModal;
