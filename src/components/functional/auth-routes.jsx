import PropTypes from "prop-types";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

function Route({isProtected, redirectPath = "/", children}) {
    const {isAuthenticated, isLoading} = useAuth0();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (isProtected ? !isAuthenticated : isAuthenticated) {
        return <Navigate to={redirectPath} state={{from: location}}/>;
    }

    return children;
}

Route.propTypes = {
    isProtected: PropTypes.bool.isRequired,
    redirectPath: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const ProtectedRoute = (props) => <Route {...props} isProtected={true}/>;
const UnProtectedRoute = (props) => <Route {...props} isProtected={false}/>;

export {ProtectedRoute, UnProtectedRoute};
