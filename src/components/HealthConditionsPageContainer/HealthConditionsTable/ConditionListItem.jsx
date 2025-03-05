import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { ActionsRename } from '@integritymarketing/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faCircleCheck,
} from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { faCheckIncomplete } from '@awesome.me/kit-7ab3488df1/icons/kit/custom';

function ConditionListItem({
  label,
  onEdit,
  areUwQuestionsComplete,
  areUwQuestionsExpired,
}) {
  return (
    <Grid
      container
      direction='row'
      sx={{ padding: '16px 24px' }}
      justifyContent='space-between'
      alignItems='center'
      alignSelf='stretch'
      gap={2}
    >
      <Grid item>
        <Typography variant='h4' sx={{ color: '#052A63' }}>
          {label}
        </Typography>
      </Grid>

      <Grid item>
        <Stack direction='row' gap={3} alignItems='center'>
          <Box display='flex' gap={1} minWidth={120}>
            {areUwQuestionsExpired ? (
              <>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  size='lg'
                  color='#C81E27'
                />
                <Typography sx={{ color: '#C81E27' }}>Expired</Typography>
              </>
            ) : areUwQuestionsComplete ? (
              <>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size='lg'
                  color='#717171'
                />
                <Typography sx={{ color: '#717171' }}>Complete</Typography>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCheckIncomplete}
                  size='lg'
                  color='#4178FF'
                />
                <Typography sx={{ color: '#4178FF' }}>Incomplete</Typography>
              </>
            )}
          </Box>
          <Button
            size='small'
            variant='link'
            sx={{
              padding: '5px 20px',
              borderRadius: '25px',
              color: '#6366F1',
              border: 'none',
              '&:hover': {
                background: '#fff 0 0 no-repeat padding-box',
                borderRadius: '20px',
                boxShadow: '0 0 10px 1px rgb(0 0 0 / 20%)',
                color: '#1357ff',
              },
            }}
            endIcon={<ActionsRename />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

ConditionListItem.propTypes = {
  label: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  areUwQuestionsComplete: PropTypes.bool,
  areUwQuestionsExpired: PropTypes.bool,
};

export default ConditionListItem;
