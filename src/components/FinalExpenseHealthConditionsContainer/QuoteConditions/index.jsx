import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import useFetch from "hooks/useFetch";
import Icon from "components/Icon";
import EditIcon from "components/icons/icon-edit";
import AddNewConditionDialog from "../AddNewConditionDialog";

import {
    COMPLETED,
    HEALTH_CONDITION_API,
    INCOMPLETE,
    OUTDATED,
} from "../FinalExpenseHealthConditionsContainer.constants";
import styles from "./styles.module.scss";
import { Complete } from "../icons/Complete";
import { Incomplete } from "../icons/Incomplete";
import OutdatedSvg from "../icons/outdated.svg";
import { Typography, Box, IconButton } from "@mui/material";

const QuoteConditions = ({ contactId, isHealthPage }) => {
    const [selectedConditionForEdit, setSelectedConditionForEdit] = useState(null);
    const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] = useState(false);
    const [healthConditions, setHealthConditions] = useState([]);
    const isLoadingRef = useRef(false);

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

    const handleOnClose = useCallback(() => {
        setIsAddNewActivityDialogOpen(false);
    }, []);

    return (
        <>
            <Box className={styles.conditionsListContainer}>
                {healthConditions.length > 0 &&
                    healthConditions?.map((condition, index) => {
                        return (
                            <Box className={styles.conditionCardContainer} key={`${condition.id}-${index}`}>
                                <Typography variant="h5" color="#052A63">
                                    {condition?.conditionName}
                                </Typography>
                                <Box className={styles.conditionInfo}>
                                    <Box className={styles.status}>
                                        {condition.isComplete ? (
                                            <>
                                                <Complete />
                                                <span className={styles.completedStatus}>{COMPLETED}</span>
                                            </>
                                        ) : condition.isComplete === false ? (
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
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            aria-label="conditions page edit"
                                            color="primary"
                                            onClick={() => {
                                                setSelectedConditionForEdit(condition);
                                                setIsAddNewActivityDialogOpen(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
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

export default React.memo(QuoteConditions);
