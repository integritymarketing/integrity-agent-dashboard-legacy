import React, { useMemo, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import * as Sentry from '@sentry/react';
import useToast from 'hooks/useToast';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { CustomModal } from 'components/MuiComponents';
import { formatCurrency } from 'utils/shared-utils/sharedUtility';
import { useLeadDetails } from 'providers/ContactDetails';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import ShareInputsValidator from 'components/ShareInputsValidator';
import { useLifeIulQuote } from 'providers/Life';
import { faArrowShare } from '@awesome.me/kit-7ab3488df1/icons/kit/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const IulCompareShareModal = ({ open, onClose, plans, quoteType }) => {
  const { handleIULQuoteShareClick, isLoadingShareIulQuote } =
    useLifeIulQuote();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newSelectedType, setNewSelectedType] = useState('email');
  const [existingSendType, setExistingSendType] = useState('');

  const showToast = useToast();

  const { agentInformation } = useAgentInformationByID();
  const { leadDetails } = useLeadDetails();

  const {
    firstName = '',
    lastName = '',
    emails = [],
    phones = [],
    leadsId,
  } = leadDetails;

  const agentFirstName = agentInformation?.agentFirstName;
  const agentLastName = agentInformation?.agentLastName;
  const agentEmail = agentInformation?.email;
  const agentPhoneNumber = agentInformation?.phone;
  const npnNumber = agentInformation?.agentNPN;
  const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? '';
  const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? '';
  const isEmailCompatibleStatus = emails?.find(
    ({ leadEmail }) => leadEmail
  )?.isValid;
  const isPhoneCompatibleStatus = phones?.find(
    ({ leadPhone }) => leadPhone
  )?.isSmsCompatible;

  const nonFormatPhoneNumber = useMemo(
    () => (phone ? `${phone}`.replace(/\D/g, '') : ''),
    [phone]
  );

  const handleSend = async () => {
    const { policyDetailId, recId, input } = plans[0];
    const recIds = plans.map(({ recId }) => recId);
    try {
      const payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        agentNpn: npnNumber,
        agentPurl: agentInformation?.agentPurl,
        caLicense: agentInformation?.caLicense,
        policyDetailId,
        recIds: recIds,
        policyDetailsUrl: 'https://qa.planenroll.com/life/products/compare',
        quoteRequest: {
          inputs: [
            {
              birthDate: input?.birthDate,
              gender: input?.gender,
              healthClasses: [input?.healthClass],
              state: input?.state,
              faceAmounts: [input?.faceAmount.toString()],
              payPeriods: [input?.payPeriod.toString()],
              solves: input?.solves,
              props: {
                illustratedRate: input?.illustratedRate,
                loanType: input?.loanType,
              },
            },
          ],
          quoteType:
            quoteType === 'accumulation' ? 'IULACCU-SOLVE' : 'IULPROT-SOLVE',
        },
      };
      if (existingSendType === 'email') {
        const data = {
          ...payload,
          messageDestination: leadEmail,
          messageType: 'Email',
        };
        await handleIULQuoteShareClick(data, true);
      } else if (existingSendType === 'textMessage') {
        const data = {
          ...payload,
          messageDestination: leadPhone,
          messageType: 'SMS',
        };
        await handleIULQuoteShareClick(data);
      } else {
        if (newSelectedType === 'email') {
          const data = {
            ...payload,
            messageDestination: email,
            messageType: 'Email',
          };
          await handleIULQuoteShareClick(data, true);
        } else {
          const data = {
            ...payload,
            messageDestination: nonFormatPhoneNumber,
            messageType: 'SMS',
          };
          await handleIULQuoteShareClick(data, true);
        }
      }
      onClose();
    } catch (err) {
      Sentry.captureException(err);
      showToast({
        type: 'error',
        message: 'Failed to share plan',
      });
    }
  };

  const isDisable = useMemo(() => {
    if (existingSendType === 'email' && leadEmail && isEmailCompatibleStatus) {
      return true;
    } else if (
      existingSendType === 'textMessage' &&
      leadPhone &&
      isPhoneCompatibleStatus
    ) {
      return true;
    } else if (existingSendType === 'newEmailOrMobile') {
      if (newSelectedType === 'email' && email) {
        return true;
      } else if (newSelectedType === 'mobile' && phone) {
        return true;
      }
    }
  }, [
    existingSendType,
    leadEmail,
    leadPhone,
    newSelectedType,
    email,
    phone,
    isPhoneCompatibleStatus,
    isEmailCompatibleStatus,
  ]);

  return (
    <CustomModal
      title='Share this Policy'
      open={open}
      handleClose={onClose}
      showCloseButton
      maxWidth='sm'
      disableContentBackground
      shouldShowCancelButton={false}
      footer
      handleSave={handleSend}
      saveLabel='Share'
      footerActionIcon={<FontAwesomeIcon icon={faArrowShare} size={'lg'} />}
      isSaveButtonDisabled={!isDisable || isLoadingShareIulQuote}
    >
      <Box className={styles.modalSection}>
        <Box className={styles.planInfoCard}>
          <Grid container gap={3}>
            {plans.map((plan, index) => {
              const {
                productName,
                companyName,
                amBest,
                deathBenefit,
                distribution,
                premium,
                companyLogoImageUrl,
              } = plan;
              return (
                <>
                  <Grid md={3.5} className={styles.divider} key={index}>
                    <Box marginBottom={2}>
                      <img
                        src={companyLogoImageUrl}
                        alt={productName}
                        className={styles.planImg}
                      />
                    </Box>
                    <Box display='flex' marginBottom={2} flexDirection='column'>
                      <Typography variant='body1' color='#434A51'>
                        {companyName}
                      </Typography>
                      <Typography variant='body1' color='#434A51'>
                        {amBest}
                      </Typography>
                    </Box>
                    <Box marginBottom={1}>
                      <Typography variant='h4' color='#052A63'>
                        {productName}
                      </Typography>
                    </Box>

                    <Box className={styles.policyDetails}>
                      <Box marginBottom={1}>
                        <Typography variant='h5' color='#052A63'>
                          {quoteType === 'accumulation'
                            ? 'Max Dist'
                            : 'Death Benefit'}
                        </Typography>
                        <Typography variant='body1' color='#717171'>
                          {quoteType === 'accumulation'
                            ? formatCurrency(distribution)
                            : formatCurrency(deathBenefit)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='h5' color='#052A63'>
                          Premium
                        </Typography>
                        <Typography variant='body1' color='#717171'>
                          {formatCurrency(premium)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Box>
        <Box>
          <ShareInputsValidator
            leadId={leadsId}
            title='How do you want to share this policy?'
            existingSendType={existingSendType}
            setExistingSendType={setExistingSendType}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            newSelectedType={newSelectedType}
            setNewSelectedType={setNewSelectedType}
          />
        </Box>
      </Box>
      {existingSendType === 'newEmailOrMobile' && (
        <Box>
          <Typography variant='body2' color='#434A51' marginTop={0.5}>
            *This {newSelectedType === 'mobile' ? 'phone number' : 'email'} will
            not be saved to the contact.
          </Typography>
        </Box>
      )}
    </CustomModal>
  );
};

IulCompareShareModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  planDetails: PropTypes.object.isRequired,
};
