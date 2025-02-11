import { Dialog, DialogTitle, Typography, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/system";
import { CloseIcon } from "components/icons/QuickQuote";
import PropTypes from "prop-types";

import FooterButtons from "./FooterButtons";
import styles from "./styles.module.scss";

export default function CustomModal({
    open = false,
    handleClose = () => {},
    title = "",
    showCloseButton = true,
    children = null,
    subtitle = "",
    footer = null,
    maxWidth = "sm",
    handleSave = () => {},
    saveLabel = "Save",
    cancelLabel = "Cancel",
    isSaveButtonDisabled = false,
    shouldShowCancelButton = true,
    disableContentBackground = false,
    className = "",
    errorMsgBar,
    footerActionIcon = null,
    iconPosition = "right",
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Dialog onClose={handleClose} open={open} maxWidth={maxWidth} fullWidth>
            <DialogTitle className={styles.dialogTitle}>
                {title && <Typography variant={isSmallScreen ? "h3" : "h2"}>{title}</Typography>}
                {showCloseButton && (
                    <Box className={styles.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </Box>
                )}
            </DialogTitle>
            <Box className={`${styles.modalBody} ${className}`}>
                {subtitle && (
                    <Typography variant="h6" sx={{ color: "var(--Integrity-Theme-Integrity-navy-default)" }}>
                        {subtitle}
                    </Typography>
                )}
                {children && (
                    <Box
                        className={styles.content}
                        style={
                            !disableContentBackground
                                ? {
                                      backgroundColor: "var(--Integrity-Theme-primitive-white)",
                                  }
                                : {}
                        }
                    >
                        {children}
                    </Box>
                )}
                {errorMsgBar && errorMsgBar}
            </Box>

            {footer && (
                <Box className={styles.footer}>
                    <FooterButtons
                        handleSave={handleSave}
                        handleClose={handleClose}
                        saveLabel={saveLabel}
                        cancelLabel={cancelLabel}
                        isSaveButtonDisabled={isSaveButtonDisabled}
                        shouldShowCancelButton={shouldShowCancelButton}
                        footerActionIcon={footerActionIcon}
                        iconPosition={iconPosition}
                    />
                </Box>
            )}
        </Dialog>
    );
}

CustomModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    showCloseButton: PropTypes.bool,
    children: PropTypes.node.isRequired,
    subtitle: PropTypes.string,
    footer: PropTypes.node,
    maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    handleSave: PropTypes.func,
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    isSaveButtonDisabled: PropTypes.bool,
    shouldShowCancelButton: PropTypes.bool,
    disableContentBackground: PropTypes.bool,
    className: PropTypes.string,
    errorMsgBar: PropTypes.node,
    footerActionIcon: PropTypes.element,
    iconPosition: PropTypes.oneOf(["left", "right"]),
};
