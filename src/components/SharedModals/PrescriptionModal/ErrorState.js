import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  textContainer: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    borderRadius: 8,
    color: "#434A51",
    display: "flex",
    fontSize: 16,
    fontFamily: "Lato",
    height: "100px",
    justifyContent: "center",
    letterSpacing: "0.16px",
    marginTop: 10,
    padding: "20px",
  },
}));

const getComponentProps = ({ searchString = "", prescriptionList = [] }) => ({
  searchString,
  prescriptionList,
});

const ErrorState = (props) => {
  const { searchString, prescriptionList } = getComponentProps(props);
  const classes = useStyles();
  const message = useMemo(() => {
    if (searchString && prescriptionList.length === 0)
      return "Prescription not found, try a different search";
    if (!searchString) return "Search for a prescription";
  }, [searchString, prescriptionList]);

  return <Typography className={classes.textContainer}>{message}</Typography>;
};

ErrorState.propTypes = {
  searchString: PropTypes.string,
  prescriptionList: PropTypes.array,
};

ErrorState.defaultProps = {
  searchString: "",
  prescriptionList: [],
};

export default ErrorState;
