import MUIButton from "@mui/material/Button";
import { styled } from "@mui/system";

const colors = {
    primary: {
        main: "#0052CE",
        color: "#FFFFFF",
        border: "#CFD1D7",
        hover: "#2175F4",
        disabled: "#A0C4F8",
        disabledColor: "#FFFFFF",
    },
    secondary: {
        main: "#FFFFFF",
        color: "#0052CE",
        border: "#0052CE",
        hover: "#F1FAFF",
        disabled: "#FFFFFF",
        disabledColor: "#C5DAF3",
    },
};

const StyledButton = styled(MUIButton)(({ variant }) => ({
    backgroundColor: colors[variant].main,
    border: `1px solid ${colors[variant].border}`,
    color: colors[variant].color,
    textTransform: "capitalize",
    fontFamily: "Lato",
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "bold",
    textAlign: "center",
    "&:hover": {
        backgroundColor: colors[variant].hover,
    },
    "&:disabled": {
        backgroundColor: colors[variant].disabled,
        color: colors[variant].disabledColor,
        cursor: "not-allowed",
        pointerEvents: "all !important",
        "&.MuiButton-secondary": {
            border: "1px solid a0c4f8",
        },
    },
}));

export const Button = ({ variant = "primary", size = "medium", disabled = false, onClick, children, ...props }) => {
    return (
        <StyledButton variant={variant} size={size} disabled={disabled} onClick={onClick} {...props}>
            {children}
        </StyledButton>
    );
};
