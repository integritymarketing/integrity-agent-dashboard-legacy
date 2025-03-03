import { Typography, Box, Checkbox } from "@mui/material";
import PropTypes from "prop-types";
import ConditionalPopupLayout from "./ConditionalPopupLayout";
import { useCallback } from "react";

const OPTIONS = ["Justo", "Nullam", "Lorem", "Quam"];

function ConditionalPopupMultiSelect({
    header,
    title,
    contentHeading,
    handleApplyClick,
    handleCancelClick,
    applyButtonDisabled,
    values,
    onChange,
    open,
    onClose,
    applyButtonText = "Next",
    error,
}) {
    const handleMultiSelection = useCallback(
        (selectedOption) => {
            if (selectedOption === null) {
                onChange([selectedOption]);
                return;
            }

            if (Array.isArray(values)) {
                onChange(
                    values.includes(selectedOption)
                        ? values.filter((opt) => opt !== selectedOption)
                        : [...values, selectedOption]
                );
            }
        },
        [values]
    );

    return (
        <ConditionalPopupLayout
            header={header}
            title={title}
            contentHeading={contentHeading}
            handleApplyClick={handleApplyClick}
            handleCancelClick={handleCancelClick}
            applyButtonDisabled={applyButtonDisabled}
            open={open}
            onClose={onClose}
            applyButtonText={applyButtonText}
        >
            {OPTIONS.map((option) => (
                <Box
                    key={option}
                    border={1}
                    m={0.5}
                    p={2}
                    display="flex"
                    alignItems="center"
                    bgcolor=""
                    borderRadius={2}
                    onClick={() => handleMultiSelection(option)}
                >
                    <Checkbox /> {option}
                </Box>
            ))}

            {error && (
                <Typography variant="body2" color="error" mt={0.5}>
                    {error}
                </Typography>
            )}
        </ConditionalPopupLayout>
    );
}

ConditionalPopupMultiSelect.propTypes = {
    header: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contentHeading: PropTypes.string.isRequired,
    handleApplyClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    applyButtonDisabled: PropTypes.bool,
    values: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    applyButtonText: PropTypes.string,
    error: PropTypes.string,
};

export default ConditionalPopupMultiSelect;
