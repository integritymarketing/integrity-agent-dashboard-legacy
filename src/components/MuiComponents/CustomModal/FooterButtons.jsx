import { Button } from "@mui/material";
import PropTypes from "prop-types";

const FooterButtons = ({
    handleClose = () => {},
    handleSave = () => {},
    saveLabel = "Save",
    cancelLabel = "Cancel",
    isSaveButtonDisabled = false,
    shouldShowCancelButton = true,
}) => (
    <>
        {shouldShowCancelButton && (
            <Button
                size="medium"
                variant="contained"
                color="secondary"
                sx={{
                    marginRight: "16px",
                }}
                onClick={handleClose}
            >
                {cancelLabel}
            </Button>
        )}
        <Button size="medium" variant="contained" color="primary" onClick={handleSave} disabled={isSaveButtonDisabled}>
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
};

export default FooterButtons;
