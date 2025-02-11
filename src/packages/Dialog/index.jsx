import * as React from "react";
import PropTypes from "prop-types";
import { Button } from "../Button";
import ActivitySubjectWithIcon from "pages/ContactDetails/ActivitySubjectWithIcon";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MUIDialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { Divider, Box } from "@mui/material";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    color: "#002D72",
    fontSize: "24px",
    fontFamily: "lato",
    fontWeight: "bold",
}));

const StyledDialog = styled(MUIDialog)(({ theme }) => ({
    borderRadius: "8px",
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: "1rem",
    backgroundColor: "#F4F8FB",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    backgroundColor: "#F4F8FB",
}));

export default function Dialog(props) {
    const {
        title,
        saveText,
        cancelText,
        onSave,
        onCancel,
        open,
        children,
        onClose,
        fullWidth,
        maxWidth = "xs",
        disabled = false,
        titleWithIcon = true,
    } = props;

    return (
        <StyledDialog onClose={onClose} open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
            {title && (
                <StyledDialogTitle>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        {titleWithIcon && <ActivitySubjectWithIcon activitySubject={title} />}
                        {title}
                    </Box>

                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: "#0052CE",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </StyledDialogTitle>
            )}
            <Divider />
            <StyledDialogContent>{children}</StyledDialogContent>
            <StyledDialogActions>
                {cancelText && (
                    <Button size={"medium"} onClick={onCancel}>
                        {cancelText}
                    </Button>
                )}
                {(onSave || saveText) && (
                    <Button disabled={disabled} size={"medium"} onClick={onSave}>
                        {saveText}
                    </Button>
                )}
            </StyledDialogActions>
        </StyledDialog>
    );
}

Dialog.propTypes = {
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    open: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    saveText: PropTypes.string,
    cancelText: PropTypes.string,
    title: PropTypes.string,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    disabled: PropTypes.bool,
};
