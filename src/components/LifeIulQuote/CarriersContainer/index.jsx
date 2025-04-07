import {Box, Typography} from '@mui/material';
import {ContactProfileTabBar} from 'components/ContactDetailsContainer';
import {IulQuoteHeader} from 'components/LifeIulQuote/CommonComponents';
import {useParams} from 'react-router-dom';
import WithLoader from 'components/ui/WithLoader';
import {useLeadDetails} from 'providers/ContactDetails';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';
import {CarrierResourceCard} from '@integritymarketing/clients-ui-kit';
import {useEffect, useState} from 'react';
import {useCarriers} from 'providers/CarriersProvider';
import _ from 'lodash';
import useUserProfile from "hooks/useUserProfile";
import {useProfessionalProfileContext} from "providers/ProfessionalProfileProvider";

export const CarriersContainer = ({ title, query }) => {
  const { contactId } = useParams();

  const { leadDetails, isLoadingLeadDetails } = useLeadDetails();

  const { getCarriersData, isLoadingGetCarriers, getAdPolicyRedirectUrl } = useCarriers();
  const [carriersData, setCarriersData] = useState([]);
  const {firstName, lastName, email, phone, npn} = useUserProfile();
  const {getAgentData} = useProfessionalProfileContext();

  useEffect(() => {
    const fetchCarriers = async () => {
      const response = await getCarriersData(`productType=${query}`);
      if (response) {
        setCarriersData(response);
      }
    };
    if (query) {
      fetchCarriers();
    }
  }, [query]);

  const fetchRedirectUrlAndOpen = async (resource, website) => {
    const agentData = await getAgentData?.();
    if (!agentData) return;
    const {
      sourceId,
      assignedBUs = [],
    } = agentData;

    const agentBUs = assignedBUs?.map((item) => item.buCode);
    const agent = {
      firstName,
      lastName,
      email,
      phone,
      npn,
      sourceId,
      agentBUs,
    };

    const {
      firstName: leadFirstName,
      lastName: leadLastName,
      birthdate,
      age,
      gender,
    } = leadDetails || {};
    const stateCode = leadDetails?.addresses?.[0]?.stateCode;
    const leadId = leadDetails?.leadsId;
    const leadPhone = leadDetails?.phones?.[0]?.leadPhone || "";
    const leadEmail = leadDetails?.emails?.[0]?.leadEmail || "";

    const payload = {
      ctaName: resource,
      ctaValue: website,
      agent,
      lead: {
        leadId,
        firstName: leadFirstName,
        lastName: leadLastName,
        email: leadEmail,
        phone: leadPhone,
        age,
        gender,
        dateOfBirth: birthdate,
        stateCode,
      },
    };

    const adPolicyRedirectUrlDetails = await getAdPolicyRedirectUrl(payload);
    if (adPolicyRedirectUrlDetails?.redirectUrl) {
      window.open(adPolicyRedirectUrlDetails.redirectUrl, "_blank");
    }
  };

  return (
    <WithLoader isLoading={isLoadingLeadDetails || isLoadingGetCarriers}>
      <ContactProfileTabBar
        contactId={contactId}
        showTabs={false}
        backButtonLabel='Back'
        backButtonRoute={`/contact/${contactId}/overview`}
      />
      <Box className={styles.carriersContainer}>
        <IulQuoteHeader title={title} />

        <Box className={styles.carriersListTitle}>
          <Typography variant='h4' color='#052A63' marginRight='4px'>
            Carrier Resources{' '}
          </Typography>
          <Typography variant='h4' color='#00000099'>
            ({carriersData?.length})
          </Typography>
        </Box>
        <Box className={styles.carriersListGridContainer}>
          <Box className={styles.carriersGrid}>
            {Array.isArray(carriersData) &&
              carriersData?.map((carrier, index) => {
                const key = _.get(carrier, 'id', index);
                const carrierData = {
                  ...carrier,
                  actionMenuItems: [
                    carrier.quote && {
                      label: 'Run Quote',
                      onClick: async () => {
                        await fetchRedirectUrlAndOpen(carrier.resource, carrier.quote);
                      },
                    },
                    carrier.illustration && {
                      label: 'Run Illustration',
                      onClick: async () => {
                        await fetchRedirectUrlAndOpen(carrier.resource, carrier.illustration);
                      },
                    },
                    carrier.eApp && {
                      label: 'Start eApp',
                      onClick: async () => {
                        await fetchRedirectUrlAndOpen(carrier.resource, carrier.eApp);
                      },
                    },
                    carrier.website && {
                      label: 'Visit Carrier',
                      onClick: async () => {
                        await fetchRedirectUrlAndOpen(carrier.resource, carrier.website);
                      },
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
  query: PropTypes.string.isRequired,
};

export default CarriersContainer;
