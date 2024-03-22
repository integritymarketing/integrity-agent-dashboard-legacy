import React from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

// Moved outside to avoid re-creation on every render
const StyledBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        right: 3,
        top: 20,
        background: 'transparent',
    },
});

const CardBadge = ({ label, IconComponent, count = '' }) => (
    <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={styles.tag}>{label}</Box>
        <IconButton size="small" aria-label={label}>
            <StyledBadge badgeContent={count} color="secondary">
                <IconComponent />
            </StyledBadge>
        </IconButton>
    </Box>
);

CardBadge.propTypes = {
    label: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType.isRequired,
    count: PropTypes.string,
};

CardBadge.defaultProps = {
    count: '',
};

export default CardBadge;

