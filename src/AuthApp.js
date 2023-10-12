import { Route, Routes } from "react-router-dom";
import { AuthAppRoutes } from "routeConfigs/AuthAppRouteConfig";

const AuthApp = () => {
  return (
    <Routes>
      {AuthAppRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default AuthApp;
