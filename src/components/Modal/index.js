import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

import RoundButton from "components/RoundButton";
import useDeviceType from "hooks/useDeviceType";

import styles from "./modal.module.scss";
import PlusIcon from "components/icons/plus";

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
    isAddPharmacy,
    onAdd,
    isCurved,
}) {
    const { isMobile } = useDeviceType();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflowY: "visible",
                },
            }}
        >
            <DialogTitle
                disableTypography
                className={styles.title}
                sx={{
                    fontSize: isMobile ? "24px" : "32px",
                    backgroundColor: "#fff",
                    boxShadow: "inset 0px -1px 0px #cccccc",
                    borderRadius: "8px 8px 0 0",
                    color: "#052a63",
                    fontFamily: "Lato",
                    fontWeight: "400px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        lineHeight: "32px",
                    }}
                >
                    <span>{title}</span>
                    <IconButton aria-label="close" className={styles.closeButton} onClick={onClose}>
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
                <DialogActions className={styles.footer} sx={{ padding: 0 }}>
                    <Box className={isCurved ? styles.curvedFooterButtons : styles.footerButtons}>
                        {onCancel ? (
                            <Button onClick={onCancel} className={styles.cancelButton}>
                                {cancelButtonName ? cancelButtonName : "Cancel"}
                            </Button>
                        ) : (
                            <Box />
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
                <DialogActions className={styles.footer}>
                    <Box className={styles.deleteContainer}>
                        <Button onClick={onDelete} className={styles.cancelButton}>
                            Delete {modalName}
                        </Button>
                    </Box>
                </DialogActions>
            )}
            {modalName === "Pharmacy" && (
                <DialogActions className={styles.footer}>
                    <Button
                        variant="text"
                        className={styles.addButton}
                        onClick={onAdd}
                        disabled={!isAddPharmacy}
                        endIcon={<PlusIcon disabled={!isAddPharmacy} />}
                    >
                        Add {modalName}
                    </Button>
                </DialogActions>
            )}
            {customFooter && customFooter}
        </Dialog>
    );
}

Modal.propTypes = {
    actionButtonDisabled: PropTypes.bool,
    actionButtonName: PropTypes.string,
    children: PropTypes.node.isRequired,
    contentStyle: PropTypes.object,
    customFooter: PropTypes.node,
    endIcon: PropTypes.node,
    hideFooter: PropTypes.bool,
    isDelete: PropTypes.bool,
    onCancel: PropTypes.func,
    cancelButtonName: PropTypes.string,
    modalName: PropTypes.string,
    onDelete: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    isAddPharmacy: PropTypes.bool,
    onAdd: PropTypes.func,
    isCurved: PropTypes.bool,
};

Modal.defaultProps = {
    actionButtonDisabled: false,
    actionButtonName: "",
    contentStyle: {},
    customFooter: null,
    endIcon: null,
    hideFooter: false,
    isDelete: false,
    onCancel: null,
    cancelButtonName: "Cancel",
    modalName: "",
    onDelete: null,
    onSave: null,
    maxWidth: "sm",
    isAddPharmacy: false,
    onAdd: null,
    isCurved: true,
};
