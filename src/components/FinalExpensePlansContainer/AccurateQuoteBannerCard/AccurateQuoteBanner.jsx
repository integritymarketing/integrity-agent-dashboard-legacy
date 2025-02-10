import {Button, Box, Typography} from '@mui/material';

const AccurateQuoteBanner = () => {
    return (
        <Box
            sx={{
                width: '328px',
                background: '#FFFFFF 0 0 no-repeat padding-box',
                borderRadius: '8px',
                opacity: 1
            }}
            display="flex"
            flexDirection="column"
            padding={2}
            borderRadius={1}
            boxShadow={1}
            bgcolor="background.paper"
            m={2}
        >
            <Typography variant="h6" sx={{
                fontFamily: 'Lato-Regular, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.16px',
                color: '#052A63',
            }}>
                Get a more accurate quote
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">
                    Add health conditions
                </Typography>
                <Button variant="contained" color="primary">
                    Add
                </Button>
            </Box>
        </Box>
    );
}

export default AccurateQuoteBanner;
