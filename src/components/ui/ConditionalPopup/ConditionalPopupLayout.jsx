import PropTypes from 'prop-types';
import { ConditionalCardLayout } from '@integritymarketing/clients-ui-kit';
import { Box, Button, Dialog, Paper, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@awesome.me/kit-7ab3488df1/icons/classic/light';

function ConditionalPopupLayout({
  header,
  title,
  contentHeading,
  handleApplyClick,
  handleCancelClick,
  applyButtonDisabled,
  children,
  open,
  onClose,
  applyButtonText,
  showAddIcon = false,
  showDeleteSection = false,
  handleRemoveClick,
}) {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
        <ConditionalCardLayout
          header={header}
          title={title}
          submitLabel={applyButtonText}
          handleApplyClick={handleApplyClick}
          handleCancelClick={handleCancelClick}
          applyButtonDisabled={applyButtonDisabled}
          showAddIcon={showAddIcon}
        >
          <Paper
            sx={{
              padding: 3,
              borderRadius: '8px',
              backgroundColor: '#FFFFF',
              boxShadow: 'none',
            }}
          >
            <Stack direction='column' spacing={1}>
              <Stack>
                <Typography variant='h5' color='#052A63'>
                  {contentHeading}
                </Typography>
              </Stack>
              <Stack>{children}</Stack>
            </Stack>
          </Paper>
        </ConditionalCardLayout>
        {header.toLowerCase().includes('update') && (
          <Box
            sx={{
              padding: 3,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#F1F1F1',
            }}
          >
            <Button
              type='Text'
              startIcon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={handleRemoveClick}
            >
              Remove
            </Button>
          </Box>
        )}
      </Dialog>
    </>
  );
}

ConditionalPopupLayout.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contentHeading: PropTypes.string.isRequired,
  handleApplyClick: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  applyButtonDisabled: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  showAddIcon: PropTypes.bool,
  showDeleteSection: PropTypes.bool,
  handleRemoveClick: PropTypes.func,
};
export default ConditionalPopupLayout;
