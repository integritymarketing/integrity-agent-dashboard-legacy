import { Box, Typography } from '@mui/material';
import { CustomModal } from 'components/MuiComponents';
import styles from './styles.module.scss';
import ContinueIcon from 'components/icons/Continue';

const LinkToContact = ({
  open,
  handleClose,
  newLeadName,
  handleSubmit,
  isLoading,
}) => {
  return (
    <CustomModal
      title={'Link to a Contact'}
      open={open}
      handleClose={handleClose}
      footer
      handleSave={handleSubmit}
      showCloseButton
      shouldShowCancelButton={true}
      disableContentBackground
      maxWidth='sm'
      isSaveButtonDisabled={isLoading}
      saveLabel={isLoading ? 'Loading...' : 'Continue'}
      footerActionIcon={<ContinueIcon />}
    >
      <Box>
        <Typography variant='h4' color='#052A63'>
          {newLeadName}
        </Typography>
        <Box className={styles.sectionTitle}>
          <Typography variant='body1' color='#434A51'>
            Saving quote details to an existing contact will update contact
            information with details from this quote, do you wish to proceed?
          </Typography>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default LinkToContact;
