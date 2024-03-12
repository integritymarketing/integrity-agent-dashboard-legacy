import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
    customButton: {
        "&.MuiButtonBase-root": {
            color: "#ffffff",
            backgroundColor: "#4178FF",
            fontSize: "16px",
            fontWeight: "500",
            textTransform: "unset",
            padding: "6px 20px",
            cursor: "pointer",
            borderRadius: "20px",
            height: "unset",
        },
        "&:hover": {
            backgroundColor: "#1357FF !important",
            boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
            color: "#ffffff !important",
        },
        "&.Mui-disabled": {
            cursor: "not-allowed !important",
            backgroundColor: "#B3C9FF",
            color: "#ffffff !important",
        },
    },
}));

const RoundButton = ({ label, ...rest }) => {
    const classes = useStyles();

    return (
        <Button {...rest} className={classes.customButton}>
            {label}
        </Button>
    );
};

RoundButton.propTypes = {
    label: PropTypes.string.isRequired,
};

export default RoundButton;
