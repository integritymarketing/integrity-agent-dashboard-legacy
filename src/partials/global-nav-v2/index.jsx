import { useEffect, useMemo, useState } from 'react';
import Media from 'react-media';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import useAgentInformationByID from 'hooks/useAgentInformationByID';
import useUserProfile from 'hooks/useUserProfile';

import InboundCallBanner from 'packages/InboundCallBanner';

import IntegrityLogo from 'components/HeaderWithLogin/Integrity-logo';
import WithLoader from 'components/ui/WithLoader';
import Modal from 'components/ui/modal';

import ContactInfo from 'partials/contact-info';
import analyticsService from 'services/analyticsService';
import { useClientServiceContext } from 'services/clientServiceProvider';

import { Box, Typography } from '@mui/material';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import { useCreateNewQuote } from 'providers/CreateNewQuote';

import MyButton from './MyButton';

import './index.scss';
import LargeFormatMenu from './large-format';
import SmallFormatMenu from './small-format';
import IntegrityMobileLogo from 'components/HeaderWithLogin/integrity-mobile-logo';
import NewBackBtn from 'images/new-back-btn.svg';
import PlusMenu from './plusMenu';
import { QUOTE_TYPE } from 'components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants';
import { useProfessionalProfileContext } from 'providers/ProfessionalProfileProvider';
import { WelcomeModal } from 'components/WelcomeModal';

const SiteNotification = ({
  showPhoneNotification,
  showMaintenaceNotification,
}) => {
  const notificationClass = [
    'site-notification2-',
    showPhoneNotification ? 'hasNotification' : null,
    showMaintenaceNotification ? 'hasMainitananceNotification' : null,
  ]
    .filter(Boolean)
    .join('-');

  if (showPhoneNotification || showMaintenaceNotification) {
    return (
      <div
        className={`site-notification2 site-notification2--notice ${notificationClass}`}
      >
        {showPhoneNotification && (
          <div data-testid='phone-number-notification'>
            <div className='site-notification2__icon'>&#9888;</div>
            <div>
              Phone number is required. Please{' '}
              <Link to='/edit-account'>update</Link> your account information.
            </div>
          </div>
        )}
        {showMaintenaceNotification && (
          <div
            className='site-notification2__maintanance'
            data-testid='maintance-notification'
          >
            <div>We are currently experiencing issues</div>
            <div className='site-maintanance-text'>
              This may affect your ability to use Integrity. We are working as
              fast as we can to resolve the issue.
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const GlobalNavV2 = ({
  showQuoteType = '',
  menuHidden = false,
  className = '',
  page,
  title,
  ...props
}) => {
  const auth = useAuth0();
  const { clientsService } = useClientServiceContext();
  const navigate = useNavigate();
  const { getAgentData, agentData, updateAgentPreferencesData } =
    useProfessionalProfileContext();
  const { getQuickQuoteLeadId } = useCreateNewQuote();
  const [navOpen, setNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const user = useUserProfile();

  const { agentInformation } = useAgentInformationByID();
  const leadPreference = agentData?.leadPreference;

  const mobileMenuProps = {
    navOpen,
    setNavOpen,
  };

  const menuProps = {
    navOpen,
    setNavOpen,
    ...(auth.isAuthenticated && !menuHidden
      ? {
          primary: [
            {
              component: Link,
              props: {
                to: '/dashboard',
                className: analyticsService.clickClass('dashbaord-header'),
              },
              label: 'Dashboard',
            },
            {
              component: Link,
              props: {
                to: '/contacts',
                className: analyticsService.clickClass('contacts-header'),
              },
              label: 'Contacts',
            },
            {
              component: Link,
              props: {
                to: '/marketing/client-connect-marketing',
                className: analyticsService.clickClass('marketing-header'),
              },
              label: 'Marketing',
            },
            {
              component: Link,
              props: {
                to: '#',
                onClick: e => {
                  e.preventDefault();
                  getQuickQuoteLeadId();
                },
                className: analyticsService.clickClass('quick-quote-header'),
              },
              label: 'Quick Quote',
            },
          ],
        }
      : {
          primary: [],
          secondary: [],
        }),
  };

  useEffect(() => {
    if (
      user?.agentId &&
      agentInformation.isLoading === false &&
      !agentInformation?.agentVirtualPhoneNumber
    ) {
      setTimeout(
        () => clientsService.generateAgentTwiloNumber(user?.agentId),
        5000
      );
    }
  }, [agentInformation, clientsService, user]);

  useEffect(() => {
    if (user?.agentId) {
      getAgentData(user?.agentId);
    }
  }, [user, getAgentData]);

  const hasPHPBuName = useMemo(() => {
    if (!agentData && !Array.isArray(agentData?.assignedBUs)) return false;
    return agentData?.assignedBUs?.some(
      unit => unit?.buCode?.toUpperCase() === 'PHP'
    );
  }, [agentData]);

  const enableContracts = useMemo(() => {
    if (!agentData) return false;
    return agentData?.enableContracts;
  }, [agentData]);

  const enableMyAgents = useMemo(() => {
    if (!agentData) return false;
    return agentData?.enableMyAgents;
  }, [agentData]);

  let showPhoneNotification = false;

  if (auth.isAuthenticated && user && !user.phone) {
    showPhoneNotification = true;
  }

  const showMaintenaceNotification =
    import.meta.env.VITE_NOTIFICATION_BANNER === 'true';
  const headernotificationClass = [
    'global-nav-v2-',
    showPhoneNotification ? 'hasNotification' : null,
    showMaintenaceNotification ? 'hasMainitananceNotification' : null,
  ]
    .filter(Boolean)
    .join('-');

  const showBanner = useMemo(() => {
    const sessionValue = sessionStorage.getItem('isAgentMobilePopUpDismissed');

    if (agentInformation?.leadPreference?.isAgentMobilePopUpDismissed) {
      return false;
    }
    if (sessionValue) {
      return false;
    }

    return true;
  }, [agentInformation, sessionStorage]);

  return (
    <WithLoader isLoading={auth.isLoading}>
      <Media
        query={'(max-width: 1330px)'}
        onChange={isMobile => {
          setIsMobile(isMobile);
        }}
      />
      <SiteNotification
        showPhoneNotification={showPhoneNotification}
        showMaintenaceNotification={showMaintenaceNotification}
      />

      <WelcomeModal
        user={user}
        open={showBanner}
        leadPreference={leadPreference}
        getAgentData={getAgentData}
        updateAgentPreferencesData={updateAgentPreferencesData}
      />

      <header
        className={`global-nav-v2 ${analyticsService.clickClass(
          'nav-wrapper'
        )} ${className} ${headernotificationClass}`}
        {...props}
      >
        <a href='#main-content' className='skip-link'>
          Jump to main content
        </a>

        {page === 'taskListMobileLayout' ? (
          <>
            <Box className='backButton' onClick={() => navigate(`/dashboard`)}>
              <Box>
                <img src={NewBackBtn} alt='Back' />
              </Box>
              <Box marginTop='2px' marginLeft='4px'>
                Back
              </Box>
            </Box>

            <Typography variant='h4' className='taskListTitle'>
              {title}
            </Typography>
          </>
        ) : (
          <div
            className={`global-nav-v2__title ${analyticsService.clickClass(
              'nav-logo'
            )}`}
          >
            <Link
              to={auth.isAuthenticated ? '/dashboard' : '/welcome'}
              className={`${showQuoteType ? 'show-medicare-center' : ''}`}
            >
              {isMobile ? <IntegrityMobileLogo /> : <IntegrityLogo />}
              <span className='visually-hidden'>Integrity</span>
            </Link>

            {showQuoteType ? (
              <Typography variant='body1' color={'#FFFFFF'}>
                {QUOTE_TYPE[showQuoteType]}
              </Typography>
            ) : (
              ''
            )}
          </div>
        )}

        {auth.isAuthenticated && !menuHidden && (
          <nav className='global-nav-v2__links'>
            <h2 className='visually-hidden'>Main Navigation</h2>
            {/*
          Causes console error in dev env only due to this issue
          https://github.com/ReactTraining/react-media/issues/139
        */}
            {isMobile && (
              <SmallFormatMenu
                {...mobileMenuProps}
                page={page}
                leadPreference={leadPreference}
                agentInformation={agentInformation}
                hasPHPBuName={hasPHPBuName}
              />
            )}
            <div className='onlyWeb flex'>
              {!isMobile && <LargeFormatMenu {...menuProps} />}
              {!isMobile && user?.firstName && leadPreference && (
                <MyButton
                  leadPreference={leadPreference}
                  page={page}
                  hasActiveCampaign={agentInformation?.hasActiveCampaign}
                />
              )}
            </div>

            {!isMobile && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <PlusMenu />
                </Box>
                <ProfileMenu
                  hasPHPBuName={hasPHPBuName}
                  enableContracts={enableContracts}
                  enableMyAgents={enableMyAgents}
                />
              </>
            )}
          </nav>
        )}
      </header>
      {auth.isAuthenticated && !menuHidden && (
        <InboundCallBanner agentInformation={agentInformation} />
      )}
      <Modal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        labeledById='dialog_help_label'
        descById='dialog_help_desc'
        testId={'header-support-modal'}
      >
        <ContactInfo testId={'header-support-modal'} />
      </Modal>
    </WithLoader>
  );
};

export default GlobalNavV2;
