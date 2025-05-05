import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import useFetch from 'hooks/useFetch';
import { GET_COUNTIES } from 'components/AddZipContainer/AddZipContainer.constants';
import ArrowForwardWithCircle from 'components/icons/version-2/ArrowForwardWithCircle';
import BackButton from 'components/BackButton';
import PlansTypeModal from 'components/PlansTypeModal';
import { ConnectModal } from '../ConnectModal';
import { Connect, Health, Overview, Policies } from './Icons';
import { useLeadDetails } from 'providers/ContactDetails';
import { toTitleCase } from 'utils/toTitleCase';
import styles from './ContactProfileTabBar.module.scss';
import { Button } from 'components/ui/Button';
import { useAgentAccountContext } from 'providers/AgentAccountProvider';
import NoProductsSelectedModal from 'components/ContactDetailsContainer/NoProductsSelectedModal';

const TABS = [
  { name: 'Overview', section: 'overview', icon: <Overview /> },
  { name: 'Health Profile', section: 'health', icon: <Health /> },
  { name: 'Policies', section: 'policies', icon: <Policies /> },
  {
    name: 'Connect',
    section: 'communications',
    icon: <Connect />,
    modalTrigger: false,
  },
];

const isTruthyOrZero = value => value || value === 0;

export const ContactProfileTabBar = ({
  contactId,
  showTabs = true,
  backButtonLabel = 'Back to Contacts',
  backButtonRoute = '/contacts/list',
  stickyHeader = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { leadId: leadIdParam } = useParams();
  const [isMultipleCounties, setIsMultipleCounties] = useState(false);
  const leadId = contactId || leadIdParam;
  const navigate = useNavigate();
  const { leadDetails, selectedTab, setSelectedTab } = useLeadDetails();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
  const [isPlanTypeModalVisible, setIsPlanTypeModalVisible] = useState(
    location.state?.showProductCategoryModal
  );
  const [isNoProductsSelectedModalOpen, setIsNoProductsSelectedModalOpen] =
    useState(false);
  const { leadPreference } = useAgentAccountContext();

  const isNoProductsSelected = useMemo(() => {
    return (
      !leadPreference?.productClassificationNames ||
      leadPreference?.productClassificationNames?.length === 0
    );
  }, [leadPreference]);

  const isContactDetailsPage = currentPath?.toLowerCase().includes('contact');
  const leadName =
    leadDetails?.firstName &&
    leadDetails?.lastName &&
    leadId === `${leadDetails?.leadsId}`
      ? [leadDetails?.firstName, leadDetails?.middleName, leadDetails?.lastName]
          .filter(Boolean)
          .join(' ')
      : '';

  const zipcode = leadDetails?.addresses?.[0]?.postalCode;
  const stateCode = leadDetails?.addresses?.[0]?.stateCode;
  const county = leadDetails?.addresses?.[0]?.county;

  const URL = `${GET_COUNTIES}${zipcode}`;
  const { Get: getCounties } = useFetch(URL);

  useEffect(() => {
    async function getCountiesData() {
      const counties = await getCounties();
      if (counties?.length > 1 && !county) {
        setIsMultipleCounties(true);
      } else {
        setIsMultipleCounties(false);
      }
    }

    if (isPlanTypeModalVisible && !county) {
      getCountiesData();
    }
  }, [URL, county, getCounties, isPlanTypeModalVisible]);

  const handleSectionChange = useCallback(
    section => {
      setSelectedTab(section);
      navigate(`/contact/${leadId}/${section}`);
    },
    [leadId, navigate, setSelectedTab]
  );

  const handleClosePlanTypeModal = useCallback(() => {
    setIsPlanTypeModalVisible(false);
  }, []);

  const handleStartQuote = useCallback(() => {
    if (isNoProductsSelected) {
      setIsNoProductsSelectedModalOpen(true);
    } else {
      setIsPlanTypeModalVisible(true);
    }
  }, []);

  const renderTab = ({ name, section, icon }) => {
    const handleClick = () => handleSectionChange(section);
    return (
      <Box key={section} className={styles.profileTab} onClick={handleClick}>
        <Box
          className={`${styles.tabIcon} ${
            selectedTab === section ? styles.selected : ''
          }`}
        >
          {icon}
        </Box>
        <Box className={styles.tabName}>{name}</Box>
      </Box>
    );
  };

  const initialAvatarValue = useMemo(() => {
    if (!leadDetails?.firstName && !leadDetails?.lastName) {
      return '';
    }
    return (leadDetails?.firstName[0] + leadDetails?.lastName[0]).toUpperCase();
  }, [leadDetails]);

  const handleBackButtonClick = () => {
    if (backButtonRoute) {
      navigate(backButtonRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      className={`${styles.navWrapper} ${stickyHeader && styles.stickyHeader}`}
    >
      <Box className={styles.contactProfileTabBar}>
        <Box className={styles.backToContacts}>
          <BackButton
            label={backButtonLabel}
            showInMobile={true}
            onClick={handleBackButtonClick}
          />
        </Box>

        <Box className={styles.profileMenu}>
          <Box className={styles.profileDetails}>
            {!isMobile && (
              <Box className={styles.profileImage}>
                <Avatar
                  sx={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#052a63',
                    border: '1px solid #FFFFFF',
                    marginRight: '16px',
                  }}
                >
                  {initialAvatarValue}
                </Avatar>
              </Box>
            )}

            <Box className={styles.profileInfo}>
              <Typography variant='h2' className={styles.userName}>
                {toTitleCase(leadName)}
              </Typography>

              <Box className={styles.userDetails}>
                {stateCode && (
                  <Box className={styles.detail}>
                    <span className={styles.detailLabel}>Location :</span>
                    <span className={styles.detailValue}>{stateCode}</span>
                  </Box>
                )}
                {isTruthyOrZero(leadDetails?.age) && (
                  <Box className={styles.detail}>
                    <span className={styles.detailLabel}>Age :</span>
                    <span className={styles.detailValue}>
                      {leadDetails.age}
                    </span>
                  </Box>
                )}
                {leadDetails?.gender && (
                  <Box className={styles.detail}>
                    <span className={styles.detailLabel}>Gender :</span>
                    <span className={styles.detailValue}>
                      {toTitleCase(leadDetails?.gender)}
                    </span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          {showTabs && (
            <Box className={styles.profileTabs}>{TABS.map(renderTab)}</Box>
          )}
          {isContactDetailsPage && showTabs && (
            <Button
              onClick={handleStartQuote}
              label='Start a Quote'
              type='primary'
              className={styles.quoteButton}
            />
          )}
        </Box>

        <Box className={styles.contactButtonContainer}>
          <Button
            onClick={() => setIsConnectModalVisible(true)}
            label='Contact'
            icon={<ArrowForwardWithCircle />}
            iconPosition='right'
            type='primary'
            className={styles.contactButton}
          />
        </Box>

        {isConnectModalVisible && (
          <ConnectModal
            isOpen={isConnectModalVisible}
            onClose={() => setIsConnectModalVisible(false)}
            leadId={leadId}
            leadDetails={leadDetails}
          />
        )}
        {isNoProductsSelectedModalOpen && (
          <NoProductsSelectedModal
            open={isNoProductsSelectedModalOpen}
            handleClose={()=> setIsNoProductsSelectedModalOpen(false)}
          />
        )}

        {isPlanTypeModalVisible && (
          <PlansTypeModal
            zipcode={zipcode}
            showPlanTypeModal={isPlanTypeModalVisible}
            isMultipleCounties={isMultipleCounties}
            handleModalClose={handleClosePlanTypeModal}
            leadId={leadId}
            county={county}
          />
        )}
      </Box>
    </Box>
  );
};

ContactProfileTabBar.propTypes = {
  contactId: PropTypes.string,
  showTabs: PropTypes.bool,
  backButtonLabel: PropTypes.string,
  backButtonRoute: PropTypes.string,
  stickyHeader: PropTypes.bool,
};
