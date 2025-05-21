import { lazy, useEffect } from 'react';
import Media from 'react-media';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  appProtectedRoutes,
  appRoutes,
  AuthAppRoutes,
} from 'routeConfigs/AppRouteConfig';
import { useAgentAvailability } from 'hooks/useAgentAvailability';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import useRemoveLeadIdsOnRouteChange from 'hooks/useRemoveLeadIdsOnRouteChange';
import {
  ProtectedRoute,
  UnProtectedRoute,
} from 'components/functional/auth-routes';
import useUserProfile from 'hooks/useUserProfile';
import * as Sentry from '@sentry/react';

const LandingPage = lazy(() => import('mobile/landing/LandingPage'));
const MaintenancePage = lazy(() => import('pages/MaintenancePage'));
const Welcome = lazy(() => import('pages/welcome'));

const App = () => {
  const [, setIsAvailable] = useAgentAvailability();
  const { agentInformation } = useAgentInformationByID();
  const { firstName, lastName, email, phone, npn } = useUserProfile();
  useRemoveLeadIdsOnRouteChange();
  const isMaintainanceMode = import.meta.env.VITE_MAINTENANCE_MODE;
  const location = useLocation();

  useEffect(() => {
    setIsAvailable(agentInformation?.isAvailable);
  }, [agentInformation?.isAvailable, setIsAvailable]);

  useEffect(() => {
    if (window.fcWidget && firstName && agentInformation) {
      const handleWidgetClosed = () => {
        const fcFrame = document.getElementById('fc_frame');
        if (fcFrame) {
          fcFrame.style.display = 'block';
        }
      };

      window.fcWidget.on('widget:closed', handleWidgetClosed);

      // Set FreshChat user properties
      window.fcWidget.user.setProperties({
        firstName,
        lastName,
        email,
        callForwardNumber: phone,
        cf_customer_id: npn,
        twilioNumber: agentInformation?.agentVirtualPhoneNumber,
      });

      return () => {
        window.fcWidget.off('widget:closed', handleWidgetClosed);
      };
    }

    return () => {};
  }, [
    firstName,
    lastName,
    email,
    phone,
    agentInformation,
    location.pathname,
    npn,
    agentInformation?.agentVirtualPhoneNumber,
  ]);

  useEffect(() => {
    const fcFrame = document.getElementById('fc_frame');
    if (location.pathname === '/help') {
      // Hide the floating icon when on the /help page
      if (fcFrame) {
        fcFrame.style.display = 'none';
      }
    } else {
      if (fcFrame) {
        fcFrame.style.display = 'block';
      }
    }
  }, [location.pathname]);

  if (isMaintainanceMode) {
    return (
      <Routes>
        <Route path='/maintenance' element={<MaintenancePage />} />
        <Route path='*' element={<Navigate to='/maintenance' />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path='/welcome'
        element={
          <UnProtectedRoute redirectPath='/'>
            <Media
              queries={{
                small: '(max-width: 767px)',
              }}
            >
              {matches => (matches.small ? <LandingPage /> : <Welcome />)}
            </Media>
          </UnProtectedRoute>
        }
      />
      {appProtectedRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute redirectPath='/'>{route.component}</ProtectedRoute>
          }
        />
      ))}
      {appRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
      {AuthAppRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default App;
