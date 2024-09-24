import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ErrorPage from "pages/Error";

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const errorListener = (event) => {
            setHasError(true);
            setError(event.error);
        };
        window.addEventListener("error", errorListener);
        return () => {
            window.removeEventListener("error", errorListener);
        };
    }, []);

    if (hasError) {
        return <ErrorPage errorMessage={error ? error.toString() : ""} />;
    }

    return children;
};

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ErrorBoundary;
