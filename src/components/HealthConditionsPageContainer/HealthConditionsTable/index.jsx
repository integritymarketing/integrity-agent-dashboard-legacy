import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Stack, Typography, Paper, Divider, Box } from "@mui/material";
import ConditionListItem from "components/HealthConditionsPageContainer/HealthConditionsTable/ConditionListItem";
import { useConditions } from "providers/Conditions";
import WithLoader from "components/ui/WithLoader";
import AddNewConditionDialog from "components/FinalExpenseHealthConditionsContainer/AddNewConditionDialog";

function HealthConditionsTable({ contactId }) {
    const { getHealthConditionsData, getHealthConditionsLoading, fetchHealthConditions } = useConditions();
    const [healthConditions, setHealthConditions] = useState([]);
    const [selectedConditionForEdit, setSelectedConditionForEdit] = useState(null);
    const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] = useState(false);

    useEffect(() => {
        if (contactId) {
            fetchHealthConditions(contactId);
        }
    }, [fetchHealthConditions, contactId]);

    const handleOnClose = useCallback(() => {
        setIsAddNewActivityDialogOpen(false);
    }, []);

    useEffect(() => {
        if (getHealthConditionsData) {
            setHealthConditions(getHealthConditionsData);
        }
    }, [getHealthConditionsData]);

    return (
        <>
            <Stack direction="column" gap={1}>
                <Typography variant="h4" sx={{ color: "#052A63" }}>
                    Conditions {`(${healthConditions?.length || 0})`}
                </Typography>

                <Paper elevation={0} sx={{ maxHeight: "345px", overflowY: "auto" }}>
                    {getHealthConditionsLoading ? (
                        <WithLoader isLoading={getHealthConditionsLoading} />
                    ) : (
                        <>
                            {healthConditions && healthConditions.length ? (
                                <Stack direction="column" divider={<Divider flexItem />}>
                                    {healthConditions?.map((condition, index) => (
                                        <ConditionListItem
                                            key={index}
                                            label={condition.conditionName}
                                            onEdit={() => {
                                                setSelectedConditionForEdit(condition);
                                                setIsAddNewActivityDialogOpen(true);
                                            }}
                                            {...condition}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ padding: "32px 24px", textAlign: "center" }}>
                                    <Typography variant="body1">This contact has no conditions</Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Paper>
            </Stack>

            {isAddNewActivityDialogOpen && (
                <AddNewConditionDialog
                    open={isAddNewActivityDialogOpen}
                    contactId={contactId}
                    selectedConditionForEdit={selectedConditionForEdit}
                    onClose={handleOnClose}
                    healthConditions={healthConditions}
                    setHealthConditions={setHealthConditions}
                    refetchConditionsList={() => fetchHealthConditions(contactId)}
                    disableLastTreatmentDate={false}
                    page={"final_expense"}
                />
            )}
        </>
    );
}

HealthConditionsTable.propTypes = {
    contactId: PropTypes.string.isRequired,
};

export default HealthConditionsTable;
