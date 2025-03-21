import { Box, Typography } from '@mui/material';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer';
import { IulQuoteHeader } from 'components/LifeIulQuote/CommonComponents';
import { useParams } from 'react-router-dom';
import WithLoader from 'components/ui/WithLoader';
import { useLeadDetails } from 'providers/ContactDetails';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';
import { CarrierResourceCard } from '@integritymarketing/clients-ui-kit';
import _ from 'lodash';

export const CarriersContainer = ({ title, carriersList }) => {
  const { contactId } = useParams();

  const { isLoadingLeadDetails } = useLeadDetails();

  return (
    <WithLoader isLoading={isLoadingLeadDetails}>
      <ContactProfileTabBar
        contactId={contactId}
        showTabs={false}
        backButtonLabel='Back'
        backButtonRoute={`/contacts/${contactId}`}
      />
      <Box className={styles.carriersContainer}>
        <IulQuoteHeader title={title} />

        <Box className={styles.carriersListTitle}>
          <Typography variant='h4' color='#052A63'>
            Carrier Resources
          </Typography>
          <Typography variant='h4' color='#00000099'>
            (8)
          </Typography>
        </Box>
        <Box className={styles.carriersListGridContainer}>
          <Box className={styles.carriersGrid}>
            {carriersList.map((carrier, index) => {
              const key = _.get(carrier, 'id', index);
              const carrierData = {
                ...carrier,
                actionMenuItems: [
                  carrier.quote && {
                    label: 'Run Quote',
                    onClick: () => window.open(carrier.quote, '_blank'),
                  },
                  carrier.illustration && {
                    label: 'Run Illustration',
                    onClick: () => window.open(carrier.illustration, '_blank'),
                  },
                  carrier.eApp && {
                    label: 'Start eApp',
                    onClick: () => window.open(carrier.eApp, '_blank'),
                  },
                  carrier.website && {
                    label: 'Visit Carrier',
                    onClick: () => window.open(carrier.website, '_blank'),
                  },
                ].filter(Boolean),
              };
              return <CarrierResourceCard key={key} carrier={carrierData} />;
            })}
          </Box>
        </Box>
      </Box>
    </WithLoader>
  );
};

CarriersContainer.propTypes = {
  title: PropTypes.string.isRequired,
  carriersList: PropTypes.array.isRequired,
};

export default CarriersContainer;
