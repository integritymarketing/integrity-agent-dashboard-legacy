import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const RedirectToAppropriateRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [searchParams] = useSearchParams();
  const redirectTo =
    searchParams.get('redirectTo') || sessionStorage.getItem('redirectTo');

  useEffect(() => {
    if (import.meta.env.VITE_BUILD_ENV !== 'Production') {
      if (isAuthenticated) {
        navigate(redirectTo || '/dashboard', { replace: true });
      } else {
        sessionStorage.setItem('redirectTo', redirectTo || '/dashboard');
        navigate('/test', { replace: true });
      }
    } else {
      if (isAuthenticated) {
        navigate(redirectTo || '/dashboard');
      } else {
        sessionStorage.setItem('redirectTo', redirectTo || '/dashboard');
        window.location.href = 'https://integrity.com';
      }
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return null;
};

export default RedirectToAppropriateRoute;
