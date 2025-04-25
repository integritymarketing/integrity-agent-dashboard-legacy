import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Menu, MenuItem, MenuList } from '@mui/material';
import ProfilePicture from '../ProfilePicture';
import ProfileNameAndProfile from '../ProfileNameAndProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { handleCSGSSO } from 'auth/handleCSGSSO';
import useUserProfile from 'hooks/useUserProfile';
import {
  Account,
  SignOut,
  LeadCenter,
  CSG,
  NeedHelp,
  MedicareLink,
  MedicareApp,
  LearningCenter,
} from '../icons';
import styles from './styles.module.scss';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersManageAgents } from "@awesome.me/kit-7ab3488df1/icons/kit/custom";
import { faFileCertificate } from '@awesome.me/kit-7ab3488df1/icons/classic/light';

const ProfileMenu = ({ hasPHPBuName }) => {
  const { logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { npn, email } = useUserProfile();
  const { agentInformation } = useAgentInformationByID();
  const { enableContracts, enableMyAgents } = agentInformation || {};
  const [anchorElement, setAnchorElement] = useState(null);
  const isMenuOpen = Boolean(anchorElement);

  const handleMenuOpen = useCallback(event => {
    setAnchorElement(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorElement(null);
  }, []);

  const handleNavigation = useCallback(
    async path => {
      switch (path) {
        case 'account':
          window.location.href = import.meta.env.VITE_AUTH_PAW_REDIRECT_URI;
          break;
        case 'contracts':
          if (enableContracts) {
            window.open(
              import.meta.env.VITE_CONNECT_APP_CONTRACTS_WEB,
              '_blank'
            );
          }
          break;
          case 'downlines':
           if (enableMyAgents) {
            window.open(
              import.meta.env.VITE_CONNECT_APP_DOWNLINES_WEB,
              '_blank'
            );
          }
          break;
        case 'learning_center':
          navigate('/learning-center');
          break;
        case 'lead_center':
          window.open(
            `${
              import.meta.env.VITE_AUTH0_LEADS_REDIRECT_URI
            }/LeadCenterSSO/?redirectTo=${encodeURIComponent('campaigns')}`,
            '_blank'
          );
          break;
        case 'medicareApp':
          window.open(import.meta.env.VITE_CONNECTURE_LINK, '_blank');
          break;
        case 'medicareLink':
          window.open(import.meta.env.VITE_SUNFIRE_SSO_URL, '_blank');
          break;
        case 'csg_app':
          getAccessTokenSilently().then(token => {
            handleCSGSSO(navigate, token, npn, email);
          });
          break;
        case 'need_help':
          navigate('/help');
          break;
        case 'sign_out':
          sessionStorage.removeItem('isAgentMobileBannerDismissed');
          sessionStorage.removeItem('isAgentMobilePopUpDismissed');
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
          break;
        default:
          console.log('Default');
      }
      handleMenuClose();
    },
    [navigate, npn, email, logout, handleMenuClose]
  );

  const menuItems = useMemo(() => {
    const items = [
      { path: 'account', label: 'Account', icon: <Account /> },
      ...(enableContracts
        ? [
            {
              path: 'contracts',
              label: 'Contracts',
              icon: (
                <FontAwesomeIcon
                  icon={faFileCertificate}
                  size="lg"
                  color="#4178FF"
                />
              ),
            },
          ]
        : []),
      ...(enableMyAgents
        ? [
            {
              path: 'downlines',
              label: 'Downlines',
              icon: (
                <FontAwesomeIcon
                  icon={faUsersManageAgents}
                  size="lg"
                  color="#4178FF"
                />
              ),
            },
          ]
        : []),
      {
        path: 'learning_center',
        label: 'LearningCENTER',
        icon: <LearningCenter />,
      },
      { path: 'lead_center', label: 'LeadCENTER', icon: <LeadCenter /> },
      { path: 'csg_app', label: 'CSG App', icon: <CSG /> },
      { path: 'medicareApp', label: 'MedicareAPP', icon: <MedicareApp /> },
      { path: 'medicareLink', label: 'MedicareLINK', icon: <MedicareLink /> },
      { path: 'need_help', label: 'Need Help?', icon: <NeedHelp /> },
      { path: 'sign_out', label: 'Sign Out', icon: <SignOut /> },
    ];

    // Remove 'LeadCENTER' if hasPHPBuName is true
    return hasPHPBuName
      ? items.filter(
          item =>
            item.label !== 'LeadCENTER' &&
            item.label !== 'MedicareLINK' &&
            item.label !== 'MedicareAPP'
        )
      : items;
  }, [hasPHPBuName]);

  return (
    <>
      <Box
        sx={{ marginLeft: '20px', cursor: 'pointer' }}
        onClick={handleMenuOpen}
        aria-haspopup='true'
        aria-expanded={isMenuOpen ? 'true' : undefined}
      >
        <ProfilePicture bordered />
      </Box>

      <Menu
        id='profile-menu'
        aria-labelledby='profile-menu-button'
        anchorEl={anchorElement}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        transition
      >
        <MenuList sx={{ padding: '0px 8px' }} className={styles.menuList}>
          <ProfileNameAndProfile withBackGround />
          {menuItems.map(item => (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={styles.menuItem}
              sx={{ padding: '6px 8px' }}
            >
              <Box className={styles.menuItemBox}>
                {item.icon}
                <Box className={styles.menuLabel}>{item.label}</Box>
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

ProfileMenu.propTypes = {
  /** Auth0 logout function */
  logout: PropTypes.func,
  /** Auth0 get access token function */
  getAccessTokenSilently: PropTypes.func,
  /** React Router navigation function */
  navigate: PropTypes.func,
  /** User profile data */
  npn: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  hasPHPBuName: PropTypes.bool,
};

export default ProfileMenu;
