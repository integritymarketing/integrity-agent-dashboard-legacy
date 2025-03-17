import React, { useState, useEffect } from 'react';
import {
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import styles from './FeedbackSurvey.module.scss';
import logoImage from '../chat-icon-prompt.png';
import { faCircleArrowRight } from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { faXmark } from '@awesome.me/kit-7ab3488df1/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EXPERIENCE_OPTIONS = [
  'The response was not accurate',
  'The response was not helpful',
  'I experienced a technical issue',
];

const FeedbackSurveyCard = ({
  onClose,
  showFeedbackSurvey,
  onFeedbackSubmit,
}) => {
  const [feedback, setFeedback] = useState({
    selectedOptions: {},
    additionalComment: '',
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    const hasSelectedOptions = Object.values(feedback.selectedOptions).some(
      isSelected => isSelected
    );
    const hasAdditionalComment = feedback.additionalComment.trim() !== '';
    setIsSubmitDisabled(!hasSelectedOptions && !hasAdditionalComment);
  }, [feedback]);

  const handleCheckboxChange = event => {
    setFeedback(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [event.target.name]: event.target.checked,
      },
    }));
  };

  const handleTextChange = event => {
    setFeedback(prev => ({
      ...prev,
      additionalComment: event.target.value,
    }));
  };

  const handleSubmitFeedback = () => {
    const selectedFeedback = Object.entries(feedback.selectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(
        ([key]) => EXPERIENCE_OPTIONS[parseInt(key.replace('option', '')) - 1]
      );

    if (
      selectedFeedback.length === 0 &&
      feedback.additionalComment.trim() === ''
    ) {
      return;
    }

    onFeedbackSubmit({
      selectedFeedback,
      additionalComment: feedback.additionalComment,
    });
  };

  return (
    <Box
      className={`${styles.feedbackSurveyCard} ${
        showFeedbackSurvey ? styles.visible : ''
      }`}
    >
      <Box className={styles.headerSection}>
        <img src={logoImage} alt='Feedback Logo' className={styles.logo} />
      </Box>

      <button className={styles.closeButtonContainer} onClick={onClose}>
        <FontAwesomeIcon icon={faXmark} size='2xs' color='#fff' />
      </button>

      <Box className={styles.surveyIntroContainer}>
        <p className={styles.surveyTitle}>
          Ask Integrity™ is still learning - we value your feedback!
        </p>
        <p className={styles.surveyInstruction}>
          Please select any issues that apply to your experience:
        </p>
      </Box>

      <Box className={styles.optionsContainer}>
        <Box className={styles.options}>
          <FormGroup className={styles.optionsGroup}>
            {EXPERIENCE_OPTIONS.map((option, index) => (
              <React.Fragment key={option}>
                <Box className={styles.checkDivider}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          feedback.selectedOptions[`option${index + 1}`] ||
                          false
                        }
                        onChange={handleCheckboxChange}
                        name={`option${index + 1}`}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': { color: 'white' },
                        }}
                      />
                    }
                    label={option}
                  />
                </Box>
                <Box className={styles.optionDivider} />
              </React.Fragment>
            ))}
          </FormGroup>

          <Box className={styles.checkDivider}>
            <Box className={styles.additionalFeedback}>
              <h4>Additional Feedback</h4>
              <TextField
                multiline
                rows={2}
                fullWidth
                variant='outlined'
                placeholder='Tell us what we can improve'
                value={feedback.additionalComment}
                onChange={handleTextChange}
                InputProps={{ style: { color: 'white' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    paddingTop: '0.5rem !important',
                    backgroundColor: '#1D3E71',
                    width: 'calc(100% - 16px)',
                    '& fieldset': { borderColor: 'rgba(113, 136, 168, 0.7)' },
                    '&:hover fieldset': {
                      borderColor: 'rgba(113, 136, 168, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      alignItems: 'flex-start',
                      verticalAlign: 'top',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgb(255, 255, 255)',
                    opacity: 1,
                    fontStyle: 'italic',
                    lineHeight: '24px',
                    letterSpacing: '0.15px',
                    textAlign: 'left',
                    verticalAlign: 'top',
                  },
                  width: '92%',
                  marginBottom: '1rem',
                  marginTop: '0.5rem',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={styles.buttonContainer}>
        <Box className={styles.buttonGroup}>
          <Button
            variant='text'
            onClick={onClose}
            sx={{
              color: 'white',
              textTransform: 'none',
              '&:hover': { background: 'none' },
            }}
          >
            Skip
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmitFeedback}
            endIcon={
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                color='#fff'
                size='lg'
              />
            }
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

FeedbackSurveyCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  showFeedbackSurvey: PropTypes.bool.isRequired,
  onFeedbackSubmit: PropTypes.func.isRequired,
};

export default FeedbackSurveyCard;
