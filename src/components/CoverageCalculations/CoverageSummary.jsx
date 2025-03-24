import React from 'react';
import { Box, Card, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

const headers = ['Asset Type', 'Client'];
const data = [
  {
    label: 'Debt',
    subLabel: 'Total Household Debt',
    icon: <FontAwesomeIcon icon={faMoneyBill} size='lg' color='#052A63' />,
    value: '$15,00,00',
  },
  {
    label: 'Debt',
    subLabel: 'Total Household Debt',
    icon: <FontAwesomeIcon icon={faMoneyBill} size='lg' color='#052A63' />,
    value: '$15,00,00',
  },
  {
    label: 'Debt',
    subLabel: 'Total Household Debt',
    icon: <FontAwesomeIcon icon={faMoneyBill} size='lg' color='#052A63' />,
    value: '$15,00,00',
  },
  {
    label: 'Debt',
    subLabel: 'Total Household Debt',
    icon: <FontAwesomeIcon icon={faMoneyBill} size='lg' color='#052A63' />,
    value: '$15,00,00',
  },
  {
    label: 'Debt',
    subLabel: 'Total Household Debt',
    icon: <FontAwesomeIcon icon={faMoneyBill} size='lg' color='#052A63' />,
    value: '$15,00,00',
  },
];

const CoverageSummary = () => {
  return (
    <>
      <Box p={2} bgcolor='#F1F1F1'>
        <Grid container alignItems='center' p={2}>
          {headers.map(header => {
            return (
              <Grid item flex={1}>
                <Typography fontWeight='bold' color='textSecondary'>
                  {header}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map(({ icon, label, subLabel, value }) => {
            return (
              <Grid
                container
                alignItems='center'
                borderBottom={1}
                p={2}
                key={label}
              >
                <Grid item gap={2} display='flex' alignItems='center' flex={1}>
                  {icon}
                  <Box>
                    <Typography fontWeight='bold'>{label}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {subLabel}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item flex={1}>
                  <Typography fontWeight='bold' color='textSecondary'>
                    {value}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}

          <Box bgcolor='#F0F2F7' p={2} borderRadius={1} display='flex' mx={2}>
            <Typography fontWeight='bold' flex={1}>
              Recommended Coverage
            </Typography>
            <Typography fontWeight='bold' flex={1}>
              $150,000
            </Typography>
          </Box>

          <Grid container alignItems='center'>
            <Typography fontWeight='bold' flex={1} ml={3}>
              Current Coverage
            </Typography>
            <Typography fontWeight='bold' flex={1} ml={-3}>
              $150,000
            </Typography>
          </Grid>
          <Grid container alignItems='center'>
            <Typography fontWeight='bold' flex={1} ml={3}>
              Additional Assets
            </Typography>
            <Typography fontWeight='bold' flex={1} ml={-3}>
              $300,000
            </Typography>
          </Grid>

          <Box
            bgcolor='#E7F0FF'
            p={2}
            borderRadius={1}
            display='flex'
            justifyContent='space-between'
            m={2}
          >
            <Typography fontWeight='bold' flex={1}>
              Additional Insurance Needed
            </Typography>
            <Typography fontWeight='bold' flex={1}>
              $150,000
            </Typography>
          </Box>
        </Card>
      </Box>
      <Typography
        variant='body2'
        color='textSecondary'
        mt={2}
        fontStyle='italic'
      >
        Calculation is based on the information provided in previous responses.
        Disclaimer: This is basic needs coverage and may not include all needs.
      </Typography>
    </>
  );
};

export default CoverageSummary;
