import React, { useCallback, useEffect, useRef, useState } from "react";

import useFetch from "hooks/useFetch";

import ContactSectionCard from "packages/ContactSectionCard";
import Table from "packages/TableWrapper";
import useAnalytics from "hooks/useAnalytics";
import Icon from "components/Icon";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";

import AddNewConditionDialog from "./AddNewConditionDialog";
import {
    ADD_NEW,
    COMPLETED,
    CONDITIONS,
    EDIT,
    HEALTH_CONDITION_API,
    INCOMPLETE,
    OUTDATED,
} from "./FinalExpenseHealthConditionsContainer.constants";
import styles from "./FinalExpenseHealthConditionsContainer.module.scss";
import { Complete } from "./icons/Complete";
import IncompleteSvg from "./icons/incomplete.svg";
import OutdatedSvg from "./icons/outdated.svg";

const FinalExpenseHealthTableSection = ({ contactId, isHealthPage }) => {
    const [selectedConditionForEdit, setSelectedConditionForEdit] = useState(null);
    const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] = useState(false);
    const [healthConditions, setHealthConditions] = useState([]);
    const isLoadingRef = useRef(false);
    const { fireEvent } = useAnalytics();

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const getHealthConditionsListData = useCallback(async () => {
        isLoadingRef.current = true;
        const resp = await getHealthConditions();
        isLoadingRef.current = false;
        if (resp) {
            setHealthConditions([...resp]);
        }
    }, []);

    useEffect(() => {
        if (!isLoadingRef.current) {
            getHealthConditionsListData();
        }
    }, []);

    useEffect(() => {
        fireEvent("Health Conditions Page Viewed", {
            leadid: contactId,
            flow: "final_expense",
        });
    }, [contactId]);

    const sectionHeaderChildren = () => {
        return (
            <div className={styles.wrapper}>
                <Button
                    icon={<Plus />}
                    iconPosition="right"
                    label={ADD_NEW}
                    onClick={() => {
                        setSelectedConditionForEdit(null);
                        setIsAddNewActivityDialogOpen(true);
                    }}
                    type="tertiary"
                    className={styles.buttonWithIcon}
                />
            </div>
        );
    };

    const columns = [
        {
            id: "name",
            Header: "",
            Cell: ({ row }) => {
                return <div className={styles.conditionNameCell}>{row.original.conditionName}</div>;
            },
        },
        ...(isHealthPage
            ? []
            : [
                  {
                      id: "status",
                      Header: "",
                      Cell: ({ row }) => {
                          return (
                              <div className={styles.conditionStatusCell}>
                                  {row.original.isComplete && (
                                      <>
                                          <Complete />
                                          <span className={styles.completedStatus}>{COMPLETED}</span>
                                      </>
                                  )}
                                  {row.original.isComplete === false && (
                                      <>
                                          <Icon image={IncompleteSvg} className={styles.statusIcon} />
                                          <span className={styles.incompleteStatus}>{INCOMPLETE}</span>
                                      </>
                                  )}
                                  {row.original.isComplete === undefined && (
                                      <>
                                          <Icon image={OutdatedSvg} className={styles.statusIcon} />
                                          <span className={styles.outdatedStatus}>{OUTDATED}</span>
                                      </>
                                  )}
                              </div>
                          );
                      },
                  },
              ]),
        {
            id: "action",
            Header: "",
            Cell: ({ row }) => {
                return (
                    <div className={styles.conditionActionCell}>
                        <Button
                            icon={<EditIcon />}
                            iconPosition="right"
                            label={EDIT}
                            onClick={() => {
                                setSelectedConditionForEdit(row?.original);
                                setIsAddNewActivityDialogOpen(true);
                            }}
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />
                    </div>
                );
            },
        },
    ];

    const handleOnClose = useCallback(() => {
        setIsAddNewActivityDialogOpen(false);
    }, []);
    return (
        <>
            <ContactSectionCard
                title={CONDITIONS}
                infoIcon={`(${healthConditions?.length})`}
                className={`${styles.activitiesContainer} ${isHealthPage ? styles.healthPageActivitiesContainer : ""}`}
                contentClassName={styles.activitiesContainer_content}
                actions={<div className="actions">{sectionHeaderChildren()}</div>}
            >
                <Table initialState={{}} data={healthConditions} columns={columns} />
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
                    page={isHealthPage ? "health_profile" : "final_expense"}
                />
            )}
        </>
    );
};

export default React.memo(FinalExpenseHealthTableSection);
