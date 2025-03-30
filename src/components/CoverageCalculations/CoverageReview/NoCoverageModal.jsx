import { Box, Button, Typography } from '@mui/material';
import Modal from 'components/Modal';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import PropTypes from 'prop-types';

const NoCoverageModal = ({ open, onBack, onContinue, onClose }) => {
  return (
    <Modal
      hideFooter
      isCurved={false}
      open={open}
      title='Coverage Estimate Not Available'
      onClose={onClose}
      customFooter={
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          bgcolor='#F1F1F1'
          px={2}
          pb={3}
        >
          <Button aria-label='Go back' onClick={onBack}>
            Back
          </Button>
          <Button
            variant='contained'
            size='medium'
            endIcon={<ButtonCircleArrow />}
            onClick={onContinue}
          >
            Continue
          </Button>
        </Box>
      }
    >
      <Box p={3}>
        <Box bgcolor='white' p={3} borderRadius={2} boxShadow={1}>
          <Typography variant='body1' mb={2}>
            In order to provide an estimate of your coverage need additional
            information is required, please review your responses:
          </Typography>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            <li>
              <Typography variant='body1' gutterBottom>
                Debt
              </Typography>
            </li>
            <li>
              <Typography variant='body1' gutterBottom>
                Income
              </Typography>
            </li>
            <li>
              <Typography variant='body1' gutterBottom>
                Mortgage
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>Education</Typography>
            </li>
          </ul>
        </Box>
      </Box>
    </Modal>
  );
};

NoCoverageModal.propTypes = {
  open: PropTypes.bool,
  onBack: PropTypes.func,
  onContinue: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default NoCoverageModal;
