import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import useFetch from 'hooks/useFetch';
import EditIcon from 'components/icons/icon-edit';
import { CollapsibleSection } from '@integritymarketing/clients-ui-kit';
import {
  COMPLETED,
  HEALTH_CONDITION_API,
} from '../../FinalExpenseHealthConditionsContainer/FinalExpenseHealthConditionsContainer.constants';
import styles from './styles.module.scss';
import { Complete } from '../../FinalExpenseHealthConditionsContainer/icons/Complete';
import { Typography, Box, Button } from '@mui/material';
import { faCircleInfo } from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from 'components/ui/Popover';
import HealthConditionQuestionModal from 'components/HealthConditionsPageContainer/HealthConditionQuestionModal';
import AddNewConditionDialog from 'components/FinalExpenseHealthConditionsContainer/AddNewConditionDialog';

const QuoteConditions = ({
  contactId,
  isHealthPage,
  isMobile,
  healthConditions,
  setHealthConditions,
  setIsLoadingHealthConditions,
}) => {
  const [selectedConditionForEdit, setSelectedConditionForEdit] =
    useState(null);
  const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] =
    useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const isLoadingRef = useRef(false);

  const { Get: getHealthConditions } = useFetch(
    `${HEALTH_CONDITION_API}${contactId}`
  );

  const getHealthConditionsListData = useCallback(async () => {
    setIsLoadingHealthConditions(true);
    isLoadingRef.current = true;
    const resp = await getHealthConditions();
    isLoadingRef.current = false;
    if (resp) {
      setIsLoadingHealthConditions(false);
      setHealthConditions([...resp]);
    } else {
      setIsLoadingHealthConditions(false);
      isLoadingRef.current = false;
      setHealthConditions([]);
    }
  }, [setIsLoadingHealthConditions, setHealthConditions]);

  useEffect(() => {
    if (!isLoadingRef.current) {
      getHealthConditionsListData();
    }
  }, []);

  const handleOnClose = useCallback(() => {
    setShowQuestionModal(false);
    getHealthConditionsListData();
  }, []);

  const completedConditions = useMemo(() => {
    return healthConditions.filter(
      condition => condition.areUwQuestionsComplete
    );
  }, [healthConditions]);

  return (
    <CollapsibleSection
      title='Conditions'
      togglePosition='left'
      infoIcon={
        <Popover
          openOn='hover'
          description='The conditions you have entered here are filtering your quote results to Products which you are likely eligible'
          positions={isMobile ? ['bottom'] : ['right', 'bottom']}
        >
          <FontAwesomeIcon icon={faCircleInfo} color='blue' />
        </Popover>
      }
    >
      <Box className={styles.conditionsListContainer}>
        {completedConditions.length > 0 &&
          completedConditions?.map((condition, index) => {
            return (
              <Box
                className={styles.conditionCardContainer}
                key={`${condition.id}-${index}`}
              >
                <Typography variant='h5' color='#052A63'>
                  {condition?.conditionName}
                </Typography>
                <Box className={styles.conditionInfo}>
                  <Box className={styles.status}>
                    <Complete />
                    <span className={styles.completedStatus}>{COMPLETED}</span>
                  </Box>
                  <Box>
                    <Button
                      variant='text'
                      color='primary'
                      size='small'
                      onClick={() => {
                        setSelectedConditionForEdit(condition);
                        setShowQuestionModal(true);
                      }}
                      endIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
      {showQuestionModal && (
        <HealthConditionQuestionModal
          modelHeader='Update Condition'
          onClose={handleOnClose}
          contactId={contactId}
          onSuccessOfHealthConditionQuestionModal={() => {
            handleOnClose();
            getHealthConditionsListData();
          }}
          selectedCondition={[selectedConditionForEdit]}
          setIsAddNewActivityDialogOpen={setIsAddNewActivityDialogOpen}
        />
      )}
      {isAddNewActivityDialogOpen && (
        <AddNewConditionDialog
          open={isAddNewActivityDialogOpen}
          contactId={contactId}
          selectedConditionForEdit={selectedConditionForEdit}
          onClose={() => setIsAddNewActivityDialogOpen(false)}
          healthConditions={healthConditions}
          setHealthConditions={setHealthConditions}
          refetchConditionsList={getHealthConditionsListData}
          disableLastTreatmentDate={isHealthPage}
          page={isHealthPage ? 'health_profile' : 'final_expense'}
        />
      )}
    </CollapsibleSection>
  );
};

export default React.memo(QuoteConditions);
