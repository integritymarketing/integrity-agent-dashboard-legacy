import React from "react";
import MUIButton from "@mui/material/Button";
import { styled } from "@mui/system";

const StyledButton = styled(MUIButton)(({ theme, variant }) => ({
  backgroundColor: theme.palette[variant].main,
  border: `1px solid ${theme.palette[variant].border}`,
  color: theme.palette[variant].color,
  textTransform: "capitalize",
  fontFamily: "Lato",
  fontSize: "16px",
  lineHeight: " 20px",
  fontWeight: "bold",
  textAlign: "center",
  "&:hover": {
    backgroundColor: theme.palette[variant].hover,
  },
  "&:disabled": {
    backgroundColor: theme.palette[variant].disabled,
    color: theme.palette[variant].disabledColor,
    cursor: "not-allowed",
    pointerEvents: "all !important",
    "&.MuiButton-secondary": {
      border: "1px solid a0c4f8",
    },
  },
}));

export const Button = ({
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
