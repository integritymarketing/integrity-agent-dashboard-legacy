import { Button } from "@mui/material";
import PropTypes from "prop-types";

const FooterButtons = ({
    handleClose = () => {},
    handleSave = () => {},
    saveLabel = "Save",
    cancelLabel = "Cancel",
    isSaveButtonDisabled = false,
    shouldShowCancelButton = true,
    footerActionIcon = null,
    iconPosition = "right",
}) => (
    <>
        {shouldShowCancelButton && (
            <Button
                size="medium"
                variant="text"
                color="primary"
                sx={{
                    marginRight: "16px",
                }}
                onClick={handleClose}
            >
                {cancelLabel}
            </Button>
        )}
        <Button
            size="medium"
            variant="contained"
            color="primary"
            sx={{
                marginLeft: "auto",
            }}
            onClick={handleSave}
            disabled={isSaveButtonDisabled}
            startIcon={iconPosition === "left" ? footerActionIcon : null}
            endIcon={iconPosition === "right" ? footerActionIcon : null}
        >
            {saveLabel}
        </Button>
    </>
);

FooterButtons.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleClose: PropTypes.func,
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    isSaveButtonDisabled: PropTypes.bool,
    shouldShowCancelButton: PropTypes.bool,
    footerActionIcon: PropTypes.element,
    iconPosition: PropTypes.oneOf(["left", "right"]),
};

export default FooterButtons;
