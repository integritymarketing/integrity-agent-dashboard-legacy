import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { handleCSGSSO } from 'auth/handleCSGSSO';
import useUserProfile from 'hooks/useUserProfile';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import {
  Contacts,
  Account,
  Dashboard,
  SignOut,
  MenuOpen,
  IntegrityHeader,
  Marketing,
  LearningCenter,
} from './icons';
import ProfileNameAndProfile from '../ProfileMenu/ProfileNameAndProfile';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const MobileMenu = ({ onClose, hasPHPBuName }) => {
  const { logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { npn, email } = useUserProfile();
  const menuRef = useRef(null);

  useOnClickOutside(menuRef, onClose);

  const menuOptionsWithIcon = [
    {
      label: 'Dashboard',
      action: () => {
        navigate('/dashboard');
        onClose();
      },
      icon: <Dashboard />,
    },
    {
      label: 'Contacts',
      action: () => {
        navigate('/contacts');
        onClose();
      },
      icon: <Contacts />,
    },
    {
      label: 'Marketing',
      action: () => {
        navigate('/marketing/client-connect-marketing');
        onClose();
      },
      icon: <Marketing />,
    },
    {
      label: 'LearningCENTER',
      action: () => {
        navigate('/learning-center');
        onClose();
      },
      icon: <LearningCenter />,
    },
    {
      label: 'Account',
      action: () => {
        window.location.href = `${import.meta.env.VITE_AUTH_PAW_REDIRECT_URI}`;
        onClose();
      },
      icon: <Account />,
    },
  ];

  const menuOptionsWithOutIcon = useMemo(() => {
    const items = [
      {
        label: 'LeadCENTER',
        action: () => {
          window.open(
            `${
              import.meta.env.VITE_AUTH0_LEADS_REDIRECT_URI
            }/LeadCenterSSO/?redirectTo=${encodeURIComponent('campaigns')}`,
            '_blank'
          );
          onClose();
        },
      },
      {
        label: 'MedicareAPP',
        action: () => {
          window.open(import.meta.env.VITE_CONNECTURE_LINK, '_blank');
          onClose();
        },
      },
      {
        label: 'MedicareLINK',
        action: () => {
          window.open(import.meta.env.VITE_SUNFIRE_SSO_URL, '_blank');
          onClose();
        },
      },
      {
        label: 'CSG App',
        action: () => {
          getAccessTokenSilently().then(token => {
            handleCSGSSO(navigate, token, npn, email);
            onClose();
          });
        },
      },
      {
        label: 'Need Help?',
        action: () => {
          navigate('/help');
          onClose();
        },
      },
    ];

    // Filter out "LeadCENTER" if hasPHPBuName is true
    return hasPHPBuName
      ? items.filter(
          item =>
            item.label !== 'LeadCENTER' &&
            item.label !== 'MedicareLINK' &&
            item.label !== 'MedicareAPP'
        )
      : items;
  }, [hasPHPBuName, onClose, getAccessTokenSilently, navigate, npn, email]);

  const signOutOption = [
    {
      label: 'Sign Out',
      action: () => {
        sessionStorage.removeItem('isAgentMobileBannerDismissed');
        sessionStorage.removeItem('isAgentMobilePopUpDismissed');
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
        onClose();
      },
      icon: <SignOut />,
    },
  ];

  return (
    <Box className={styles.innerContainer} ref={menuRef}>
      <Box className={styles.closeButton}>
        <Box onClick={onClose}>
          <MenuOpen />
        </Box>
      </Box>
      <Box className={styles.header}>
        <ProfileNameAndProfile />
      </Box>
      <Divider className={styles.divider} />
      <Box>
        <List>
          {menuOptionsWithIcon?.map((option, index) => (
            <ListItem
              key={index}
              onClick={option.action}
              sx={{ minWidth: 'unset' }}
            >
              {option.icon && (
                <ListItemIcon sx={{ minWidth: 'unset', marginRight: '8px' }}>
                  {option.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={option.label}
                className={styles.menuText}
              />
            </ListItem>
          ))}
        </List>
        <Divider className={styles.divider} />
        <List>
          {menuOptionsWithOutIcon.map((option, index) => (
            <ListItem
              key={index}
              onClick={option.action}
              className={styles.menuItem}
            >
              <ListItemText
                primary={option.label}
                className={styles.menuText}
              />
            </ListItem>
          ))}
        </List>
        <Divider className={styles.divider} />
        <List>
          {signOutOption.map((option, index) => (
            <ListItem
              key={index}
              onClick={option.action}
              className={styles.menuItem}
            >
              {option.icon && (
                <ListItemIcon sx={{ minWidth: 'unset', marginRight: '8px' }}>
                  {option.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={option.label}
                className={styles.menuText}
              />
            </ListItem>
          ))}
        </List>
        <Divider className={styles.divider} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            alignItems: 'center',
          }}
        >
          <IntegrityHeader />
        </Box>
      </Box>
    </Box>
  );
};

MobileMenu.propTypes = {
  onClose: PropTypes.func,
};

export default MobileMenu;
