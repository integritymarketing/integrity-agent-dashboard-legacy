import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import useFetch from 'hooks/useFetch';

import ContactSectionCard from 'packages/ContactSectionCard';
import Table from 'packages/TableWrapper';
import useAnalytics from 'hooks/useAnalytics';
import Icon from 'components/Icon';
import EditIcon from 'components/icons/icon-edit';
import Plus from 'components/icons/plus';
import { Button } from 'components/ui/Button';

import AddNewConditionDialog from './AddNewConditionDialog';
import {
  ADD_NEW,
  COMPLETED,
  CONDITIONS,
  EDIT,
  HEALTH_CONDITION_API,
  INCOMPLETE,
  OUTDATED,
} from './FinalExpenseHealthConditionsContainer.constants';
import styles from './FinalExpenseHealthConditionsContainer.module.scss';
import { Complete } from './icons/Complete';
import { Incomplete } from './icons/Incomplete';
import OutdatedSvg from './icons/outdated.svg';
import Media from 'react-media';
import { Arrow } from './icons/Arrow';
import { Typography, Box, Link } from '@mui/material';

const FinalExpenseHealthTableSection = ({ contactId, isHealthPage }) => {
  const [selectedConditionForEdit, setSelectedConditionForEdit] =
    useState(null);
  const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] =
    useState(false);
  const [healthConditions, setHealthConditions] = useState([]);

  const isLoadingRef = useRef(false);
  const { fireEvent } = useAnalytics();
  const [isMobile, setIsMobile] = useState(false);

  const { Get: getHealthConditions } = useFetch(
    `${HEALTH_CONDITION_API}${contactId}`
  );

  const onAddClick = () => {
    setSelectedConditionForEdit(null);
    setIsAddNewActivityDialogOpen(true);
  };
  const getHealthConditionsListData = useCallback(async () => {
    isLoadingRef.current = true;
    const resp = await getHealthConditions();
    isLoadingRef.current = false;
    if (resp) {
      setHealthConditions([...resp]);
    } else {
      setHealthConditions([]);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingRef.current) {
      getHealthConditionsListData();
    }
  }, []);

  const healthConditionsPageViewEvent = () => {
    fireEvent('Health Conditions Page Viewed', {
      leadid: contactId,
      flow: isHealthPage ? 'health_profile' : 'final_expense',
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      healthConditionsPageViewEvent();
    }, 2000);
    return () => clearTimeout(timer);
  }, [contactId]);

  const sectionHeaderChildren = () => {
    return (
      <div className={styles.wrapper}>
        <Button
          icon={<Plus />}
          iconPosition='right'
          label={ADD_NEW}
          onClick={onAddClick}
          type='tertiary'
          className={styles.buttonWithIcon}
        />
      </div>
    );
  };

  const columns = [
    {
      accessorKey: 'conditionName',
      header: () => null,
      cell: ({ row }) => (
        <div className={styles.conditionNameCell}>
          {row.original.conditionName}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => null,
      enableSorting: true, // Allow sorting on this column if required
      cell: ({ row }) => (
        <div className={styles.conditionStatusCell}>
          {row.original.isComplete ? (
            <>
              <Complete />
              <span className={styles.completedStatus}>{COMPLETED}</span>
            </>
          ) : row.original.isComplete === false ? (
            <>
              <Incomplete />
              <span className={styles.incompleteStatus}>{INCOMPLETE}</span>
            </>
          ) : (
            <>
              <Icon image={OutdatedSvg} className={styles.statusIcon} />
              <span className={styles.outdatedStatus}>{OUTDATED}</span>
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'statusMobile',
      header: () => null,
      cell: ({ row }) => (
        <div className={styles.flex}>
          <div className={styles.conditionStatusCell}>
            {row.original.isComplete ? (
              <>
                <Complete />
                <span className={styles.completedStatus}>{COMPLETED}</span>
              </>
            ) : row.original.isComplete === false ? (
              <>
                <Incomplete />
                <span className={styles.incompleteStatus}>{INCOMPLETE}</span>
              </>
            ) : (
              <>
                <Icon image={OutdatedSvg} className={styles.statusIcon} />
                <span className={styles.outdatedStatus}>{OUTDATED}</span>
              </>
            )}
          </div>
          <div
            className={styles.arrowStyle}
            onClick={() => {
              setSelectedConditionForEdit(row?.original);
              setIsAddNewActivityDialogOpen(true);
            }}
          >
            <Arrow />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: () => null,
      cell: ({ row }) => (
        <Button
          icon={<EditIcon />}
          iconPosition='right'
          label={EDIT}
          onClick={() => {
            setSelectedConditionForEdit(row?.original);
            setIsAddNewActivityDialogOpen(true);
          }}
          type='tertiary'
          className={styles.buttonWithIcon}
        />
      ),
    },
    {
      accessorKey: 'healthAction',
      header: () => null,
      cell: ({ row }) => (
        <div
          className={styles.editCta}
          onClick={() => {
            setSelectedConditionForEdit(row?.original);
            setIsAddNewActivityDialogOpen(true);
          }}
        >
          <Arrow />
        </div>
      ),
    },
  ];

  // Adjust columns dynamically based on `isHealthPage` and `isMobile`
  const dynamicColumns = useMemo(() => {
    return [
      columns[0], // nameCol
      ...(isHealthPage ? [] : isMobile ? [columns[2]] : [columns[1]]), // statusCol or statusMobileCol
      ...(isHealthPage && isMobile
        ? [columns[4]]
        : isMobile
        ? []
        : [columns[3]]), // actionCol or healthActionCol
    ];
  }, [isHealthPage, isMobile, columns]);

  const handleOnClose = useCallback(() => {
    setIsAddNewActivityDialogOpen(false);
  }, []);
  return (
    <>
      <Media
        query={'(max-width: 500px)'}
        onChange={value => {
          setIsMobile(value);
        }}
      />

      <ContactSectionCard
        title={CONDITIONS}
        infoIcon={`(${healthConditions.length})`}
        className={`${styles.activitiesContainer} ${
          isHealthPage ? styles.healthPageActivitiesContainer : ''
        }`}
        contentClassName={styles.activitiesContainer_content}
        actions={<div className='actions'>{sectionHeaderChildren()}</div>}
      >
        {healthConditions.length === 0 && (
          <div className={styles.noItemsWrapper}>
            <div className='no-items'>
              <span>This contact has no conditions.&nbsp;</span>
              <button
                className='link'
                data-gtm={`button-add-${CONDITIONS}`}
                onClick={onAddClick}
              >
                {' '}
                Add a condition
              </button>
            </div>
          </div>
        )}
        {healthConditions.length > 0 && (
          <Table
            initialState={{}}
            data={healthConditions}
            columns={dynamicColumns}
          />
        )}
      </ContactSectionCard>

      {isAddNewActivityDialogOpen && (
        <AddNewConditionDialog
          open={isAddNewActivityDialogOpen}
          contactId={contactId}
          selectedConditionForEdit={selectedConditionForEdit}
          onClose={handleOnClose}
          healthConditions={healthConditions}
          setHealthConditions={setHealthConditions}
          refetchConditionsList={getHealthConditionsListData}
          disableLastTreatmentDate={isHealthPage}
          page={isHealthPage ? 'health_profile' : 'final_expense'}
        />
      )}
    </>
  );
};

export default React.memo(FinalExpenseHealthTableSection);
