import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';

const CoverageCalculationsCard = ({
  title,
  subTitle,
  children,
  onContinue,
  onBack,
  onSkip,
  showBackButton,
  isContinueButtonDisabled,
  primaryButtonLabel = 'Continue',
  showSkipButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid justifyContent='center' my={7} mx={2}>
      <Grid item lg={12} xs={12}>
        <Card
          sx={{
            px: { xs: 3, md: 7 },
            py: { xs: 3, md: 5 },
            width: '100%',
            maxWidth: '1000px',
            mx: 'auto',
          }}
        >
          <CardContent>
            <Typography variant='h3' gutterBottom color='#052A63'>
              {title}
            </Typography>
            <Typography variant='body1' color='#434A51' gutterBottom>
              {subTitle}
            </Typography>
            {children}
          </CardContent>

          <CardActions>
            {isMobile ? (
              <Box width='100%'>
                <Button
                  variant='contained'
                  aria-label='Continue to next step'
                  size='large'
                  disabled={isContinueButtonDisabled}
                  endIcon={<ButtonCircleArrow />}
                  onClick={onContinue}
                  fullWidth
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {primaryButtonLabel}
                </Button>
                <Box
                  textAlign={!showBackButton ? 'center' : ''}
                  justifyContent={showBackButton ? 'space-between' : ''}
                  display={showBackButton ? 'flex' : ''}
                  mt={2}
                >
                  {showBackButton && (
                    <Button aria-label='Go back' onClick={onBack}>
                      Back
                    </Button>
                  )}
                  {showSkipButton && (
                    <Button
                      variant='text'
                      aria-label='Skip this step'
                      onClick={onSkip}
                    >
                      Skip
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <>
                <Box flex={1} justifyContent='flex-start'>
                  {showBackButton && (
                    <Button aria-label='Go back' onClick={onBack}>
                      Back
                    </Button>
                  )}
                </Box>
                <Box flex={1} textAlign='right'>
                  {showSkipButton && (
                    <Button
                      variant='text'
                      aria-label='Skip this step'
                      onClick={onSkip}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    variant='contained'
                    size='medium'
                    aria-label='Continue to next step'
                    sx={{ marginLeft: '16px' }}
                    endIcon={<ButtonCircleArrow />}
                    onClick={onContinue}
                    disabled={isContinueButtonDisabled}
                  >
                    {primaryButtonLabel}
                  </Button>
                </Box>
              </>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

CoverageCalculationsCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  children: PropTypes.node,
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  onSkip: PropTypes.func,
  showBackButton: PropTypes.bool,
  isContinueButtonDisabled: PropTypes.bool,
};

CoverageCalculationsCard.defaultProps = {
  subTitle: '',
  children: null,
  onBack: () => {},
  onSkip: () => {},
  showBackButton: false,
};

export default CoverageCalculationsCard;
