import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Card,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PRESCRIPTION_TOOLTIP } from '../HealthConditionContainer.constants';
import styles from '../styles.module.scss';
import Media from 'react-media';

const PrescriptionCard = styled(Card)({
  padding: '14px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '4px',
  color: '#4B5563',
});

function SavedPrescriptions({ prescriptions, onPrescriptionClick }) {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <>
      <Media
        query='(max-width: 500px)'
        onChange={isMobile => {
          setIsMobile(isMobile);
        }}
      />
      <Typography
        variant='h4'
        sx={{ color: '#052A63', display: 'flex', alignItems: 'center' }}
      >
        Search with saved prescription
        <Tooltip
          title={PRESCRIPTION_TOOLTIP}
          sx={{
            '& .MuiTooltip-tooltip': {
              boxShadow: 'none',
            },
          }}
          placement={isMobile ? 'bottom' : 'right'}
          enterTouchDelay={0}
        >
          <IconButton
            size='small'
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#4178FF' }} />
          </IconButton>
        </Tooltip>
      </Typography>

      <Box sx={{ maxHeight: '120px', overflowY: 'auto' }} px={2}>
        <Grid container spacing={2}>
          {prescriptions.map((prescription, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <PrescriptionCard
                elevation={0}
                onClick={() => onPrescriptionClick(prescription)}
                className={styles.prescriptionCard}
              >
                <Typography variant='h5'>
                  {prescription.dosage.drugName}
                </Typography>
              </PrescriptionCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

SavedPrescriptions.propTypes = {
  prescriptions: PropTypes.array.isRequired,
  onPrescriptionClick: PropTypes.func.isRequired,
};

export default SavedPrescriptions;
