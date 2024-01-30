import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
    textContainer: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        borderRadius: 8,
        color: "#434A51",
        display: "flex",
        fontSize: "16px !important",
        fontFamily: "Lato",
        height: "100px",
        justifyContent: "center",
        letterSpacing: "0.16px",
        marginTop: "10px !important",
        padding: "20px",
    },
}));

const getComponentProps = ({ searchString = "", list = [], title = "", defaultMessage }) => ({
    searchString,
    list,
    title,
    defaultMessage,
});

const ErrorState = (props) => {
    const { searchString, list, title, defaultMessage } = getComponentProps(props);
    const classes = useStyles();
    const message = useMemo(() => {
        if (searchString && list.length === 0) return `${title} not found, try a different search`;
        if (!searchString) return `Search for a ${title}`;
    }, [searchString, list, title]);

    return <Typography className={classes.textContainer}>{defaultMessage ? defaultMessage : message}</Typography>;
};

ErrorState.propTypes = {
    searchString: PropTypes.string,
    list: PropTypes.array,
    title: PropTypes.string,
};

ErrorState.defaultProps = {
    searchString: "",
    list: [],
    title: "",
};

export default ErrorState;
