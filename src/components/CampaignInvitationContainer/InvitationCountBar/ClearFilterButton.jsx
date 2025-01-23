import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import {PreviewCollapse} from "@integritymarketing/icons";

const ClearFilterButton = ({ onClear }) => {
    return (
        <Button
            onClick={onClear}
            variant="text"
            color="primary"
            endIcon={
                <PreviewCollapse color="#4178FF" size="md"/>
            }
        >
            <Typography variant="body1" color="primary">
                Clear Filter
            </Typography>
        </Button>
    );
};

ClearFilterButton.propTypes = {
    onClear: PropTypes.func.isRequired, // Function to handle the clear action
};

export default ClearFilterButton;
