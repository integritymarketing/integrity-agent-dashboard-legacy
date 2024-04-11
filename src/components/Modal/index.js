import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";

import RoundButton from "components/RoundButton";

import useDeviceType from "hooks/useDeviceType";

const useStyles = makeStyles(() => ({
    cancelButton: {
        color: "#4178FF !important",
        fontSize: "16px",
        fontWeight: "600 !important",
        height: "40px",
        padding: "15px!important",
        textTransform: "capitalize !important",
        borderRadius: "20px !important",

        "&:hover": {
            backgroundColor: "#FFFFFF !important",
            boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
        },
    },
    closeButton: {
        color: "#FFFFFF !important",
        marginBottom: "10px !important",
        padding: "2px !important",
        transform: "rotate(0deg)",
        transition: "transform 1s",
        backgroundColor: "#CCCCCC !important",
        "&:hover": {
            transition: "transform 1s",
            transform: "rotate(90deg)",
            color: "#FFFFFF !important",
            backgroundColor: "#CCCCCC !important",
        },
    },
    footer: {
        backgroundColor: "#F1F1F1",
        display: "flex",
        flexDirection: "column",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
    },

    footerButtons: {
        backgroundColor: "#F1F1F1",
        borderRadius: "0px 0px 8px 8px",
        borderBotom: "1px solid #CCCCCC",

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
    children,
    contentStyle,
    customFooter,
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
}) {
    const classes = useStyles();
    const { isMobile } = useDeviceType();

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
                <DialogTitle
                    disableTypography
                    className={classes.title}
                    sx={{
                        fontSize: isMobile ? "24px !important" : "32px !important",
                    }}
                >
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>{title}</span>
                        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent
                    style={{
                        backgroundColor: "#F1F1F1",
                        padding: "24px",
                        borderRadius: hideFooter ? "8px" : "",
                        ...(contentStyle || {}),
                    }}
                >
                    {children}
                </DialogContent>
                {!hideFooter && (
                    <DialogActions className={classes.footer}>
                        <Box className={classes.footerButtons}>
                            {onCancel ? (
                                <Button onClick={onCancel ? onCancel : onClose} className={classes.cancelButton}>
                                    {cancelButtonName ? cancelButtonName : "Cancel"}
                                </Button>
                            ) : (
                                <Box> </Box>
                            )}
                            {actionButtonName && (
                                <RoundButton
                                    onClick={onSave}
                                    endIcon={endIcon}
                                    disabled={actionButtonDisabled}
                                    label={actionButtonName}
                                />
                            )}
                        </Box>
                    </DialogActions>
                )}
                {isDelete && (
                    <DialogActions className={classes.footer}>
                        <Box className={classes.deleteContainer}>
                            <Button onClick={onDelete} className={classes.cancelButton}>
                                Delete {modalName}
                            </Button>
                        </Box>
                    </DialogActions>
                )}
                {customFooter && customFooter}
            </Dialog>
        </div>
    );
}
