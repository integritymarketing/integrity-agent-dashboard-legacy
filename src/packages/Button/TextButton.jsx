import React from "react";
import MUIButton from "@mui/material/Button";
import { styled } from "@mui/system";

const StyledTextButton = styled(MUIButton)(({ theme, variant }) => ({
    textTransform: "capitalize",
    fontFamily: "Lato",
    fontSize: "16px",
    lineHeight: " 20px",
    fontWeight: "bold",
    color: "#4178ff",
    "&:disabled": {
        color: "#a0c4f8",
        backgroundColor: "#ffffff",
        cursor: "not-allowed",
        pointerEvents: "all !important",
    },
}));

export const TextButton = ({
    variant = "text",
    size = "medium",
    disabled = false,
    onClick,
    children,
    startIcon,
    endIcon,
    ...rest
}) => {
    return (
        <StyledTextButton
            variant={variant}
            size={size}
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            {...rest}
        >
            {children}
        </StyledTextButton>
    );
};
