import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDialogTitle = styled(DialogTitle)({
    backgroundColor: "#FFFFFF",
    borderRadius: "8px 8px 0px 0px",
    boxShadow: "inset 0px -1px 0px #CCCCCC",
    color: "#052A63",
    fontFamily: "Lato",
    fontSize: "32px !important",
    letterSpacing: "0.32px",
});

const StyledIconButton = styled(IconButton)({
    backgroundColor: "#DDDDDD",
    color: "#FFFFFF",
    marginBottom: "5px",
    padding: "0px",
    transform: "rotate(0deg)",
    transition: "transform 1s",
    "&:hover": {
        backgroundColor: "#BBBBBB",
        transition: "transform 1s",
        transform: "rotate(90deg)",
    },
});

const StyledActionButton = styled(Button)(({ theme, disabled }) => ({
    backgroundColor: disabled ? "#B3C9FF" : "#4178FF",
    borderRadius: "20px",
    color: "#FFFFFF",
    padding: "20px 16px", // Adjusted padding for better alignment
    textTransform: "capitalize",
    display: "flex", // Set display to flex
    justifyContent: "center", // Center items horizontally
    alignItems: "center", // Center items vertically
    "&:hover": {
        backgroundColor: "#4178FF",
    },
    ".Mui-disabled": {
        backgroundColor: "#B3C9FF",
        color: "#FFFFFF",
        cursor: "not-allowed",
    },
    "& .MuiButton-endIcon": {
        display: "inherit", // Inherit the display property from the button
        marginLeft: "8px", // Add some space between the text and the icon
        marginTop: "10px", // Adjusted margin for better alignment
    },
}));

const StyledCancelButton = styled(Button)({
    color: "#4178FF",
    fontSize: "16px",
    fontWeight: "600",
    height: "40px",
    padding: "10px 15px",
    textTransform: "capitalize",
    "&:hover": {
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
    },
});

const StyledFooter = styled(DialogActions)({
    backgroundColor: "#F1F1F1",
    display: "flex",
    flexDirection: "column",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
});

const StyledFooterButtons = styled(Box)({
    backgroundColor: "#F1F1F1",
    borderRadius: "0px 0px 8px 8px",
    borderBotom: "1px solid #CCCCCC",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    width: "100%",
    display: "flex",
});

const StyledDeleteContainer = styled(Box)({
    "& button:hover": {
        backgroundColor: "#FFFFFF",
    },
});

export default function Modal({
    actionButtonDisabled,
    actionButtonName,
    actionButtonClassName,
    children,
    contentStyle,
    customFooter,
    dialogContentClassName,
    endIcon,
    hideFooter = false,
    isDelete,
    onCancel,
    cancelButtonName,
    modalName,
    onDelete,
    onClose,
    onSave,
    open,
    title,
    maxWidth = "sm",
    cancelClassName,
    closeIcon,
    titleClassName,
}) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={maxWidth}
                fullWidth
                style={{ borderRadius: 8 }}
                PaperProps={{ style: { height: "auto", overflowY: "visible" } }}
            >
                <StyledDialogTitle disableTypography className={titleClassName}>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                            height: "55px",
                        }}
                    >
                        <span>{title}</span>
                        <StyledIconButton aria-label="close" onClick={onClose}>
                            {closeIcon ? closeIcon : <CloseIcon />}
                        </StyledIconButton>
                    </div>
                </StyledDialogTitle>
                <DialogContent
                    className={dialogContentClassName}
                    style={{ backgroundColor: "#F1F1F1", ...(contentStyle || {}) }}
                >
                    {children}
                </DialogContent>
                <StyledFooter>
                    {!hideFooter && (
                        <StyledFooterButtons>
                            {onCancel && (
                                <StyledCancelButton onClick={onCancel} className={cancelClassName}>
                                    {cancelButtonName || "Cancel"}
                                </StyledCancelButton>
                            )}
                            {actionButtonName && (
                                <StyledActionButton
                                    onClick={onSave}
                                    className={actionButtonClassName}
                                    endIcon={<span>{endIcon}</span>}
                                    disabled={actionButtonDisabled}
                                >
                                    {actionButtonName}
                                </StyledActionButton>
                            )}
                        </StyledFooterButtons>
                    )}
                    {isDelete && (
                        <StyledDeleteContainer>
                            <StyledCancelButton onClick={onDelete}>Delete {modalName}</StyledCancelButton>
                        </StyledDeleteContainer>
                    )}
                    {customFooter}
                </StyledFooter>
            </Dialog>
        </div>
    );
}
