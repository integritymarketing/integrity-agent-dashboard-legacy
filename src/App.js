import { lazy } from "react";
import Media from "react-media";
import { Navigate, Route, Routes } from "react-router-dom";

import { appProtectedRoutes, appRoutes } from "routeConfigs/AppRouteConfig";

import useRemoveDuplicateIdsOnRouteChange from "hooks/useRemoveDuplicateIdsOnRouteChange";

import { ProtectedRoute, UnProtectedRoute } from "components/functional/auth-routes";

const LandingPage = lazy(() => import("mobile/landing/LandingPage"));
const MaintenancePage = lazy(() => import("pages/MaintenancePage"));
const Welcome = lazy(() => import("pages/welcome"));

const App = () => {
    useRemoveDuplicateIdsOnRouteChange();
    const isMaintainanceMode = process.env.REACT_APP_MAINTENANCE_MODE;

    if (isMaintainanceMode) {
        return (
            <Routes>
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="*" element={<Navigate to="/maintenance" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route
                path="/welcome"
                element={
                    <UnProtectedRoute redirectPath="/">
                        <Media
                            queries={{
                                small: "(max-width: 767px)",
                            }}
                        >
                            {(matches) => (matches.small ? <LandingPage /> : <Welcome />)}
                        </Media>
                    </UnProtectedRoute>
                }
            />
            {appProtectedRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedRoute redirectPath="/">{route.component}</ProtectedRoute>}
                />
            ))}
            {appRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.component} />
            ))}
        </Routes>
    );
};

export default App;
