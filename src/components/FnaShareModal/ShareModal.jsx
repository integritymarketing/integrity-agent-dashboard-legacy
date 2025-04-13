import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { CustomModal } from 'components/MuiComponents';
import ShareInputsValidator from 'components/ShareInputsValidator';
import { faArrowShare } from '@awesome.me/kit-7ab3488df1/icons/kit/custom';
import { useMemo, useState } from 'react';
import { useLeadDetails } from 'providers/ContactDetails';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import PropTypes from 'prop-types';
import { useCoverageCalculationsContext } from 'providers/CoverageCalculations';

const ShareModal = ({ open, onClose, financialNeedsAnalysis }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newSelectedType, setNewSelectedType] = useState('email');
  const [existingSendType, setExistingSendType] = useState('email');
  const { leadDetails } = useLeadDetails();
  const { agentInformation } = useAgentInformationByID();
  const { sendFNADetails, isSendFNADetailsPosting } =
    useCoverageCalculationsContext();

  const {
    firstName = '',
    lastName = '',
    emails = [],
    phones = [],
    leadsId,
  } = leadDetails;

  const {
    agentFirstName,
    agentLastName,
    email: agentEmail,
    phone: agentPhoneNumber,
    agentNPN: npnNumber,
    caLicense,
    modifyDate,
    createDate,
    agentPurl,
  } = agentInformation || {};

  const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? '';
  const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? '';
  const isEmailCompatibleStatus = emails?.find(
    ({ leadEmail }) => leadEmail
  )?.isValid;

  const isPhoneCompatibleStatus = phones?.find(
    ({ leadPhone }) => leadPhone
  )?.isSmsCompatible;

  const [isEmailCompatible, setIsEmailCompatible] = useState(
    isEmailCompatibleStatus
  );
  const [isPhoneCompatible, setIsPhoneCompatible] = useState(
    isPhoneCompatibleStatus
  );

  const isDisable = useMemo(() => {
    if (existingSendType === 'email' && leadEmail && isEmailCompatible) {
      return true;
    } else if (
      existingSendType === 'textMessage' &&
      leadPhone &&
      isPhoneCompatible
    ) {
      return true;
    } else if (existingSendType === 'newEmailOrMobile') {
      if (newSelectedType === 'email' && email) {
        return true;
      } else if (newSelectedType === 'mobile' && phone) {
        return true;
      }
    }
    return false;
  }, [
    existingSendType,
    leadEmail,
    leadPhone,
    newSelectedType,
    email,
    phone,
    isPhoneCompatible,
    isEmailCompatible,
  ]);

  const handleSend = async () => {
    try {
      const payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName,
        agentLastName,
        agentPhoneNumber,
        agentEmail,
        agentNpn: npnNumber,
        caLicense,
        agentPurl,
        sendFNAUrl: 'https://qa.planenroll.com/life/fna/review',
        fna: {
          ...financialNeedsAnalysis,
        },
        modifyDate,
        createDate,
        leadId: leadsId,
      };
      let payloadData;
      if (existingSendType === 'email') {
        payloadData = {
          ...payload,
          messageDestination: leadEmail,
          messageType: 'Email',
        };
      } else if (existingSendType === 'textMessage') {
        payloadData = {
          ...payload,
          messageDestination: leadPhone,
          messageType: 'SMS',
        };
      } else {
        if (newSelectedType === 'email') {
          payloadData = {
            ...payload,
            messageDestination: email,
            messageType: 'Email',
          };
        } else {
          payloadData = {
            ...payload,
            messageDestination: phone,
            messageType: 'SMS',
          };
        }
      }

      await sendFNADetails(payloadData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomModal
      title='Share this Coverage Needs'
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
      isSaveButtonDisabled={!isDisable || isSendFNADetailsPosting}
    >
      <Box bgcolor='#fff' p={3} borderRadius={1}>
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
            isEmailCompatabile={isEmailCompatible}
            setIsEmailCompatabile={setIsEmailCompatible}
            isPhoneCompatabile={isPhoneCompatible}
            setIsPhoneCompatabile={setIsPhoneCompatible}
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

ShareModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  financialNeedsAnalysis: PropTypes.object.isRequired,
};

export default ShareModal;
