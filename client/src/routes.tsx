import { IRoutesConfig } from 'auth-react-router';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/use-auth';
import LoginPage from './pages/login-page';
import DashboardPage from './pages/dashboard/dashboard-page';
import Header from './shared/header';

const PrivatePagesOutlet = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const CheckAuthPage = () => {
  const navigate = useNavigate();
  const { isAuthorized, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthorized) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isLoading, isAuthorized]);

  return null;
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/dashboard',
  InvalidUserRoleFallback: () => null,
  public: [
    {
      path: '/login',
      component: <LoginPage />,
    },
  ],
  private: [
    {
      path: '/dashboard',
      component: <PrivatePagesOutlet />,
      children: [
        {
          index: true,
          component: <DashboardPage />,
        },
      ],
    },
  ],
  common: [
    {
      path: '/',
      component: <CheckAuthPage />,
    },
    {
      path: '*',
      component: <>Page not found</>,
    },
  ],
};
