import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  CARD_TITLE,
  DISCLAIMER_TEXT,
  HEADER_TITLE,
  CONTINUE_TO_QUOTE,
  NO_CONDITIONS,
  SIMPLIFIED_IUL_TITLE,
  SEARCH_BY_PRESCRIPTION,
} from './HealthConditionContainer.constants';
import styles from './styles.module.scss';
import { useCreateNewQuote } from '../../providers/CreateNewQuote';
import ConditionalProfileBar from 'components/QuickerQuote/Common/ConditionalProfileBar';
import Typography from '@mui/material/Typography';
import { Box, Stack, Link, Alert, AlertTitle } from '@mui/material';
import HealthConditionSearchInput from './HealthConditionSearchInput';
import SavedPrescriptions from './SavedPrescriptions';
import HealthConditionsTable from './HealthConditionsTable';
import HealthConditionSearchByPrescription from './HealthConditionSearchByPrescription';
import { useHealth } from 'providers/ContactDetails';
import { useEffect } from 'react';
import AddPrescriptionModal from './AddPrescriptionModal';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import { FullWidthButton } from '@integritymarketing/clients-ui-kit';
import HealthConditionQuestionModal from './HealthConditionQuestionModal';
import { useConditions } from 'providers/Conditions';
import WithLoader from 'components/ui/WithLoader';
import { useLeadDetails } from 'providers/ContactDetails';
import useAnalytics from "hooks/useAnalytics";

const HealthConditionsPageContainer = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const {isSimplifiedIUL, isQuickQuotePage} = useCreateNewQuote();
  const { fetchHealthConditions } = useConditions();
  const { prescriptions, fetchPrescriptions } = useHealth();
  const { leadDetails, isLoadingLeadDetails } = useLeadDetails();
  const { consumerId } = leadDetails || {};
  const {fireEvent} = useAnalytics();

  const {
    selectedPrescription,
    openAddPrescriptionModal,
    prescriptionDetails,
    selectedCondition,
    openQuestionModal,
    handlePrescriptionClick,
    setOpenAddPrescriptionModal,
    setPrescriptionDetails,
    setSelectedPrescription,
    handleApplyClickOfAddPrescriptionModal,
    handleCloseQuestionModal,
    healthConditions,
    isConditionAddedAlready,
  } = useConditions();

  useEffect(() => {
    if (contactId) {
      fetchPrescriptions(contactId);
    }
  }, [contactId, fetchPrescriptions]);

  const amplitudeEventAndNavigate = () => {
    navigate(
      `${
        isSimplifiedIUL() ? '/simplified-iul' : '/finalexpenses'
      }/plans/${contactId}${
        isQuickQuotePage ? '?quick-quote=true' : ''
      }`,
      {
        state: {from: loc?.pathname},
      }
    )
  }

  return (
    <WithLoader loading={isLoadingLeadDetails}>
      <ConditionalProfileBar
        leadId={contactId}
        page='healthConditions'
        hideButton={true}
      />
      <Box className={styles.pageHeading}>
        <Typography variant='h2' color='#052A63'>
          {isSimplifiedIUL() ? SIMPLIFIED_IUL_TITLE : 'Final Expense'}
        </Typography>
      </Box>
      <Box className={styles.pageContainerWrapper}>
        <Box className={styles.pageContainer}>
          {isConditionAddedAlready && (
            <Alert severity='error'>
              <AlertTitle>Duplicated Condition</AlertTitle>
              This condition has already been added.
            </Alert>
          )}
          <Box>
            <Box className={styles.headerTitle}>
              <h4>{HEADER_TITLE}</h4>
            </Box>
            <h3 className={styles.conditionsLabel}>{CARD_TITLE}</h3>
          </Box>

          <Box className={styles.conditionsContainer}>
            <Stack direction='column' gap={3}>
              <HealthConditionSearchByPrescription
                selectedPrescription={selectedPrescription}
                setOpenAddPrescriptionModal={setOpenAddPrescriptionModal}
                setPrescriptionDetails={setPrescriptionDetails}
                setSelectedPrescription={setSelectedPrescription}
              />
              {prescriptions.length > 0 && (
                <SavedPrescriptions
                  prescriptions={prescriptions}
                  onPrescriptionClick={handlePrescriptionClick}
                />
              )}
            </Stack>
            <HealthConditionSearchInput
              contactId={contactId}
              setOpenAddPrescriptionModal={setOpenAddPrescriptionModal}
              consumerId={consumerId}
              isSimplifiedIUL={isSimplifiedIUL()}
            />
          </Box>
          <Box className={styles.conditionsContainer}>
            <HealthConditionsTable contactId={contactId} />
            {healthConditions?.length === 0 && (
              <Typography variant='body2' sx={{ textAlign: 'center' }}>
                <Link
                  component='button'
                  variant='body2'
                  onClick={e => {
                    e.stopPropagation();
                    navigate(
                      `${
                        isSimplifiedIUL() ? '/simplified-iul' : '/finalexpenses'
                      }/plans/${contactId}${
                        isQuickQuotePage ? '?quick-quote=true' : ''
                      }`,
                      {
                        state: { from: loc?.pathname },
                      }
                    );
                  }}
                  sx={{
                    display: 'inline',
                    padding: 0,
                    minWidth: 'auto',
                  }}
                >
                  {NO_CONDITIONS}
                </Link>
              </Typography>
            )}
            <Typography
              variant='body2'
              sx={{ color: '#6B7280', fontStyle: 'italic' }}
            >
              {DISCLAIMER_TEXT}
            </Typography>
          </Box>
          <FullWidthButton
            label={CONTINUE_TO_QUOTE}
            onClick={() => amplitudeEventAndNavigate() }
            type='primary'
            icon={<ButtonCircleArrow />}
            fullWidth={true}
            iconPosition='right'
            style={{ border: 'none' }}
            className={styles.nextButton}
          />
        </Box>
      </Box>
      {openAddPrescriptionModal && (
        <AddPrescriptionModal
          consumerId={consumerId}
          open={openAddPrescriptionModal}
          onClose={() => {
            setOpenAddPrescriptionModal(false);
            setPrescriptionDetails(null);
            setSelectedPrescription(null);
          }}
          prescriptionDetails={prescriptionDetails}
          contactId={contactId}
          onHandleApplyClickOfAddPrescriptionModal={value => {
            handleApplyClickOfAddPrescriptionModal(
              value,
              SEARCH_BY_PRESCRIPTION
            );
            fetchHealthConditions(contactId);
            setPrescriptionDetails(null);
            setSelectedPrescription(null);
          }}
        />
      )}
      {openQuestionModal && (
        <HealthConditionQuestionModal
          modelHeader={openQuestionModal}
          onClose={handleCloseQuestionModal}
          contactId={contactId}
          onSuccessOfHealthConditionQuestionModal={() => {
            handleCloseQuestionModal();
            fetchHealthConditions(contactId);
          }}
          selectedCondition={selectedCondition}
          isSimplifiedIUL={isSimplifiedIUL()}
        />
      )}
    </WithLoader>
  );
};

export default HealthConditionsPageContainer;
