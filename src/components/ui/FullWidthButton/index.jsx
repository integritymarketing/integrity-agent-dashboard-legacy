import PropTypes from "prop-types";
import { Button } from "@mui/material";

function FullWidthButton({ variant, label, iconPosition, icon, className, disabled, onClick, ...props }) {
    return (
        <Button
            variant={variant}
            fullWidth
            sx={{
                padding: "11px 20px",
            }}
            disabled={disabled}
            onClick={onClick}
            startIcon={iconPosition === "left" ? icon : null}
            endIcon={iconPosition === "right" ? icon : null}
            className={className}
            {...props}
        >
            {label}
        </Button>
    );
}

FullWidthButton.propTypes = {
    variant: PropTypes.oneOf(["text", "contained", "outlined"]),
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(["left", "right"]),
    className: PropTypes.string,
};

FullWidthButton.defaultProps = {
    variant: "contained",
    onClick: undefined,
    disabled: false,
    iconPosition: "left",
    icon: <></>,
    className: "",
};

export default FullWidthButton;
