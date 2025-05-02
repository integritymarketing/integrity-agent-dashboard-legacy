import { Typography, Box } from '@mui/material';
import { CustomModal } from 'components/MuiComponents';
import PropTypes from 'prop-types';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import styles from './styles.module.scss';

export default function NoProductsSelectedModal({
  open = false,
  handleClose = () => {},
}) {
  const handleNavigateToAgentProfile = () => {
    window.location.href = `${
      import.meta.env.VITE_AUTH_PAW_REDIRECT_URI
    }/agent-profile?preference-modal=true`;
  };
  return (
    <CustomModal
      title='Add Product Specialties'
      open={open}
      handleClose={handleClose}
      footer
      handleSave={handleNavigateToAgentProfile}
      saveLabel='Add Product Specialties'
      maxWidth='sm'
      disableContentBackground
      showCloseButton
      shouldShowCancelButton={false}
      footerActionIcon={<ButtonCircleArrow />}
    >
      <Box className={styles.modalContent}>
        <Typography variant='h4' color='#052A63' marginBottom={1}>
          Product Specialties are required
        </Typography>
        <Typography variant='body1' color='#434A51'>
          Before you can start a quote you’ll need to tell us which products you
          sell. Please go to your{' '}
          <span
            className={styles.linkStyles}
            onClick={handleNavigateToAgentProfile}
          >
            Agent Profile
          </span>{' '}
          to add them.
        </Typography>
      </Box>
    </CustomModal>
  );
}

NoProductsSelectedModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
