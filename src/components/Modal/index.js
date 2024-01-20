import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    addButton: {
        backgroundColor: "#4178FF !important",
        borderRadius: "20px !important",
        color: "#FFFFFF !important",
        padding: "20px 16px !important",
        textTransform: "capitalize !important",

        "&:hover": {
            backgroundColor: "#4178FF !important",
        },
        "&.Mui-disabled": {
            backgroundColor: "#B3C9FF !important",
            color: "#FFFFFF !important",
            cursor: "not-allowed",
            "& svg #Icon_Arrow_path": {
                // targeting the svg path by id
                fill: "transparent", // changing the fill color
            },
            "& svg #Icon_circle_path": {
                // targeting the svg path by id
                fill: "#FFFFFF", // changing the fill color
            },
            "& svg #Icon_Add_path": {
                // targeting the svg path by id
                fill: "transparent", // changing the fill color
            },
        },
    },
    buttonIcon: {
        marginTop: "10px",
    },
    cancelButton: {
        color: "#4178FF",
        fontSize: "16px",
        fontWeight: "600",
        height: "40px",
        padding: "10px 15px",
        textTransform: "capitalize !important",

        "&:hover": {
            backgroundColor: "#FFFFFF !important",
            borderRadius: "20px",
            boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
        },
    },
    closeButton: {
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
    },
    footer: {
        backgroundColor: "#F1F1F1",
        display: "flex",
        flexDirection: "column",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
    },

    footerButtons: {
        backgroundColor: "#F1F1F1",
        borderRadius: "0px 0px 8px 8px",
        borderBotom: "1px solid #CCCCCC",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        width: "100%",
        display: "flex",
    },

    title: {
        backgroundColor: "#FFFFFF",
        borderRadius: "8px 8px 0px 0px",
        boxShadow: "inset 0px -1px 0px #CCCCCC",
        color: "#052A63",
        fontFamily: "Lato",
        fontSize: "32px !important",
        letterSpacing: "0.32px",
    },
    paperScrollPaper: {
        overflowY: "visible",
    },

    deleteContainer: {
        "& button:hover": {
            backgroundColor: "#FFFFFF",
        },
    },
}));

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
    const classes = useStyles();

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={maxWidth}
                fullWidth
                style={{
                    borderRadius: 8,
                }}
                PaperProps={{
                    style: {
                        height: "auto",
                        overflowY: "visible",
                    },
                }}
            >
                <DialogTitle disableTypography className={`${classes.title} ${titleClassName}`}>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                            height: "55px",
                        }}
                    >
                        <span>{title}</span>
                        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                            {closeIcon ? closeIcon : <CloseIcon />}
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent
                    className={dialogContentClassName}
                    style={{ backgroundColor: "#F1F1F1", ...(contentStyle || {}) }}
                >
                    {children}
                </DialogContent>
                <DialogActions className={classes.footer}>
                    {!hideFooter && (
                        <Box className={classes.footerButtons}>
                            {onCancel ? (
                                <Button
                                    onClick={onCancel ? onCancel : onClose}
                                    className={`${classes.cancelButton} ${cancelClassName}`}
                                >
                                    {cancelButtonName ? cancelButtonName : "Cancel"}
                                </Button>
                            ) : (
                                <Box> </Box>
                            )}
                            {actionButtonName && (
                                <Button
                                    onClick={onSave}
                                    className={`${classes.addButton} ${actionButtonClassName}`}
                                    endIcon={<span className={classes.buttonIcon}>{endIcon}</span>}
                                    disabled={actionButtonDisabled}
                                >
                                    {actionButtonName}
                                </Button>
                            )}
                        </Box>
                    )}
                    {isDelete && (
                        <Box className={classes.deleteContainer}>
                            <Button onClick={onDelete} className={classes.cancelButton}>
                                Delete {modalName}
                            </Button>
                        </Box>
                    )}
                    {customFooter && customFooter}
                </DialogActions>
            </Dialog>
        </div>
    );
}
