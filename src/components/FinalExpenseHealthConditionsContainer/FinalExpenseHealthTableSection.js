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
import { Incomplete } from "./icons/Incomplete";
import OutdatedSvg from "./icons/outdated.svg";
import Media from "react-media";
import { Arrow } from "./icons/Arrow";

const FinalExpenseHealthTableSection = ({ contactId, isHealthPage }) => {
    const [selectedConditionForEdit, setSelectedConditionForEdit] = useState(null);
    const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] = useState(false);
    const [healthConditions, setHealthConditions] = useState([]);
    const isLoadingRef = useRef(false);
    const { fireEvent } = useAnalytics();
    const [isMobile, setIsMobile] = useState(false);

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const onAddClick = () => {
        setSelectedConditionForEdit(null);
        setIsAddNewActivityDialogOpen(true);
    }
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

    const healthConditionsPageViewEvent = () => {
        fireEvent("Health Conditions Page Viewed", {
            leadid: contactId,
            flow: isHealthPage ? "health_profile" : "final_expense",
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
                    iconPosition="right"
                    label={ADD_NEW}
                    onClick={onAddClick}
                    type="tertiary"
                    className={styles.buttonWithIcon}
                />
            </div>
        );
    };

    const nameCol = {
        id: "name",
        Header: "",
        Cell: ({ row }) => {
            return <div className={styles.conditionNameCell}>{row.original.conditionName}</div>;
        }
    };

    const actionCol = {
        id: "action",
        Header: "",
        Cell: ({ row }) => {
            return <Button
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
        },
    };

    const statusCol = {
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
                            <Incomplete />
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
    };

    const statusMobileCol = {
        id: "status",
        Header: "",
        Cell: ({ row }) => {
            return (
                <div className={styles.flex}>
                    <div className={styles.conditionStatusCell}>
                        {row.original.isComplete && (
                            <>
                                <Complete />
                                <span className={styles.completedStatus}>{COMPLETED}</span>
                            </>
                        )}
                        {row.original.isComplete === false && (
                            <>
                                <Incomplete />
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
                    <div className={styles.arrowStyle} onClick={() => {
                        setSelectedConditionForEdit(row?.original);
                        setIsAddNewActivityDialogOpen(true);
                    }}><Arrow /></div>
                </div>

            );
        },
    };

    const healthActionCol = {
        id: "action",
        Header: "",
        Cell: ({ row }) => {
            return (
                <div className={styles.editCta} onClick={() => {
                    setSelectedConditionForEdit(row?.original);
                    setIsAddNewActivityDialogOpen(true);
                }}><Arrow /></div>

            );
        },
    };

    const columns = [
        nameCol,
        ...(isHealthPage ? [] : (isMobile ? [statusMobileCol] : [statusCol])),
        ...(isHealthPage && isMobile ? [healthActionCol] : (isMobile ? [] : [actionCol]))
    ];

    const handleOnClose = useCallback(() => {
        setIsAddNewActivityDialogOpen(false);
    }, []);
    return (
        <>
            <Media
                query={"(max-width: 500px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <ContactSectionCard
                title={CONDITIONS}
                infoIcon={`(${healthConditions.length})`}
                className={`${styles.activitiesContainer} ${isHealthPage ? styles.healthPageActivitiesContainer : ""}`}
                contentClassName={styles.activitiesContainer_content}
                actions={<div className="actions">{sectionHeaderChildren()}</div>}
            >

                {healthConditions.length === 0 && (
                    <div className={styles.noItemsWrapper}>
                        <div className="no-items">
                            <span>This contact has no conditions.&nbsp;</span>
                            <button
                                className="link"
                                data-gtm={`button-add-${CONDITIONS}`}
                                onClick={onAddClick}
                            >
                                {" "}
                                Add a condition
                            </button>
                        </div>
                    </div>
                )}
                {healthConditions.length > 0 && (
                    <Table initialState={{}} data={healthConditions} columns={columns} />
                )}

            </ContactSectionCard >

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
            )
            }
        </>
    );
};

export default React.memo(FinalExpenseHealthTableSection);