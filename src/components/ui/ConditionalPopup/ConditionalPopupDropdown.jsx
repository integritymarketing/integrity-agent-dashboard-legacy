import { Select, MenuItem, Typography } from "@mui/material";
import PropTypes from "prop-types";
import ConditionalPopupLayout from "./ConditionalPopupLayout";

const OPTIONS = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Maybe", value: "Maybe" },
    { label: "I don't know", value: "I don't know" },
];

function ConditionalPopupDropdown({
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
            <Select value={values ?? "Yes"} onChange={(event) => onChange(event.target.value)}>
                {OPTIONS.map(({ value, label }) => {
                    return <MenuItem value={value}>{label}</MenuItem>;
                })}
            </Select>
            {error && (
                <Typography variant="body2" color="error" mt={0.5}>
                    {error}
                </Typography>
            )}
        </ConditionalPopupLayout>
    );
}

ConditionalPopupDropdown.propTypes = {
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

export default ConditionalPopupDropdown;
